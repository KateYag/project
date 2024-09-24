import {Chart, PieController, ArcElement, Tooltip, Legend} from 'chart.js';
import {HttpUtils} from "../utils/http-utils";

// Регистрируем компоненты Chart.js
Chart.register(PieController, ArcElement, Tooltip, Legend);

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.currentPeriod = 'today';
        this.charts = {};
        this.init();


    }

    async init() {
        // this.pieChart();
        // this.pieChartTwo();
        this.setupFilterListeners();
        const todayButton = document.querySelector('[data-period="today"]');
        if (todayButton) {
            this.updateActiveButton(todayButton);
        }
        await this.getOperations(this.currentPeriod);

    }

    setupFilterListeners() {
        const filterButtons = document.querySelectorAll('.menu button');
        filterButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const period = event.target.getAttribute('data-period');
                this.currentPeriod = period;
                await this.getOperations(this.currentPeriod).then();
                this.updateActiveButton(event.target);
            });
        });

        document.querySelector('.date-interval').addEventListener('change', async() => {
            const dateFrom = document.querySelector('#dateFrom').value;
            const dateTo = document.querySelector('#dateTo').value;
            if (this.currentPeriod === 'interval') {
                await this.getOperations(this.currentPeriod, dateFrom, dateTo);
            }
        });
    }

    updateActiveButton(activeButton) {
        const filterButtons = document.querySelectorAll('.menu button');
        filterButtons.forEach(button => {
            button.classList.remove('active');
            button.style.backgroundColor = '';
            button.style.color = '';
        });
        activeButton.classList.add('active');
        activeButton.style.backgroundColor = '#6c757d';
        activeButton.style.color = '#fff';
    }

    // async getData(url) {
    //     const result = await HttpUtils.request(url, 'GET', true);
    //     if (result.error) {
    //         console.error(`Ошибка при получении данных с ${url}: Unauthorized`);
    //         return null;
    //     }
    //     return result.response;
    // }
    //
    // async pieChart() {
    //     const data = await this.getData('/operations?period=all');
    //     if (data) {
    //         const incomeData = data.filter(item => item.type === 'income');
    //         const ctx = document.getElementById('myChart').getContext('2d');
    //         if (ctx) {
    //             const labels = incomeData.map(item => item.category);
    //             const values = incomeData.map(item => item.amount);
    //
    //             new Chart(ctx, {
    //                 type: 'pie',
    //                 data: {
    //                     labels: labels,
    //                     datasets: [{
    //                         data: values,
    //                         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    //                         hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    //                     }]
    //                 },
    //                 options: {
    //                     responsive: false, // Отключить адаптивность, чтобы использовать установленные размеры
    //                     maintainAspectRatio: false, // Не поддерживать соотношение сторон
    //                     plugins: {
    //                         legend: {
    //                             position: 'top',
    //                         },
    //                         tooltip: {
    //                             enabled: true,
    //                         }
    //                     }
    //                 }
    //             });
    //         } else {
    //             console.error("Элемент canvas с id 'myChart' не найден");
    //         }
    //     }
    // }
    //
    // async pieChartTwo() {
    //     const data = await this.getData('/operations?period=all');
    //     if (data) {
    //         const incomeData = data.filter(item => item.type === 'expense');
    //         const ctx = document.getElementById('expensesMyChart').getContext('2d');
    //         if (ctx) {
    //             const labels = incomeData.map(item => item.category);
    //             const values = incomeData.map(item => item.amount);
    //
    //             new Chart(ctx, {
    //                 type: 'pie',
    //                 data: {
    //                     labels: labels,
    //                     datasets: [{
    //                         data: values,
    //                         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    //                         hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    //                     }]
    //                 },
    //                 options: {
    //                     responsive: false, // Отключить адаптивность, чтобы использовать установленные размеры
    //                     maintainAspectRatio: false, // Не поддерживать соотношение сторон
    //                     plugins: {
    //                         legend: {
    //                             position: 'top',
    //                         },
    //                         tooltip: {
    //                             enabled: true,
    //                         }
    //                     }
    //                 }
    //             });
    //         } else {
    //             console.error("Элемент canvas с id 'expensesMyChart' не найден");
    //         }
    //     }
    // }

    async getOperations(period, dateFrom = '', dateTo = '') {
        let url = `/operations?period=${period}`;
        if (period === 'interval') {
            url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }
        const result = await HttpUtils.request(url, 'GET', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе карточек дохода.');
        }

        //this.showOperations(result.response);
        this.updateCharts(result.response);

    }

    updateCharts(data) {
        const incomeData = data.filter(item => item.type === 'income' && item.category);
        const expenseData = data.filter(item => item.type === 'expense' && item.category);
        console.log('Income Data:', incomeData);
        console.log('Expense Data:', expenseData);

        // Обновляем диаграмму доходов
        this.updatePieChart('myChart', incomeData);

        // Обновляем диаграмму расходов
        this.updatePieChart('expensesMyChart', expenseData);
    }

    updatePieChart(canvasId, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');

        const categoryData = {}; // сумма по категориям
        data.forEach(item => {
            if (categoryData[item.category]) {
                categoryData[item.category] += item.amount;
            } else {
                categoryData[item.category] = item.amount;
            }
        });
        const labels = Object.keys(categoryData); // Уникальные категории
        const values = Object.values(categoryData); // Суммы для каждой категории
        //const labels = data.map(item => item.category);
       // const values = data.map(item => item.amount);

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }


        this.charts[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        enabled: true,
                    }
                }
            }
        });
    }


}
