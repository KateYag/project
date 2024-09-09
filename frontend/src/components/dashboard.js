import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

// Регистрируем компоненты Chart.js
Chart.register(PieController, ArcElement, Tooltip, Legend);

export class Dashboard {
    constructor() {
        this.init();
    }

    async init() {
        this.pieChart();
        this.pieChartTwo();

    }

    pieChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Red', 'Blue', 'Yellow'],
                    datasets: [{
                        data: [300, 50, 100],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                    }]
                },
                options: {
                    responsive: false, // Отключить адаптивность, чтобы использовать установленные размеры
                    maintainAspectRatio: false, // Не поддерживать соотношение сторон
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
        } else {
            console.error("Элемент canvas с id 'myChart' не найден");
        }
    }
    pieChartTwo() {
        const ctx = document.getElementById('expensesMyChart').getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Red', 'Blue', 'Yellow'],
                    datasets: [{
                        data: [300, 50, 100],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                    }]
                },
                options: {
                    responsive: false, // Отключить адаптивность, чтобы использовать установленные размеры
                    maintainAspectRatio: false, // Не поддерживать соотношение сторон
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
        } else {
            console.error("Элемент canvas с id 'myChart' не найден");
        }
    }
}
