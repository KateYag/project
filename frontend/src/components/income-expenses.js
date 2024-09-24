import {HttpUtils} from "../utils/http-utils";

export class IncomeExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.currentPeriod = 'today';
        this.initFilters();
        this.getOperations(this.currentPeriod).then();
        this.popupDelete();
        this.notDeleteElement();
        this.deleteElement();
    }
    async getOperations(period, dateFrom = '', dateTo = '') {
        let url = `/operations?period=${period}`;
        if (period === 'interval') {
            url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }
        let result = await HttpUtils.request(url);
        if(result.redirect) {
            return  this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе карточек дохода.');
        }

        this.showOperations(result.response);

    }


    showOperations(result) {
        console.log(result);
        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = '';
        for (let i = 0; i < result.length; i++) {
            if (!result[i].category) {
                continue; // Пропускаем этот элемент, если категория пустая
            }

            const trElement = document.createElement('tr');
            trElement.setAttribute('data-id', result[i].id);
            trElement.setAttribute('data-category', result[i].category || '');
            trElement.setAttribute('id', `tr-${result[i].id}`);
            trElement.insertCell().innerText = i + 1;
            let typeHtml = null;
            switch (result[i].type) {
                case 'expense':
                    typeHtml = '<span class="text-danger">расход</span>'
                    break;
                case 'income':
                    typeHtml = '<span class="text-success">доход</span>'
                    break;
                default:
                    typeHtml = '<span>неизвестно</span>';
            }
            trElement.insertCell().innerHTML = typeHtml;
            trElement.insertCell().innerText = result[i].category || 'Нет данных';
            trElement.insertCell().innerText = result[i].amount || 'Нет данных';
            trElement.insertCell().innerText = result[i].date || 'Нет данных';
            trElement.insertCell().innerText = result[i].comment || 'Нет данных';
            trElement.insertCell().innerHTML = '<div class="link">' +
                '<a href="javascript:void(0)" class="delete-popup-open" data-id="' + result[i].id + '"><span class="fa fa-trash"></span></a>' +
                '<a href="/edit-card-element-extended?id=' + result[i].id + '" ><span class="fa fa-pencil"></span></a>' +
            '</div>';
            recordsElement.appendChild(trElement);
        }

        this.popupDelete();
    }
    initFilters() {
        const filterButtons  = document.querySelectorAll('.menu button');
        filterButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const period = event.target.innerText.toLowerCase();
                //this.getOperations(period);
                this.handleFilterChange(period, event.target);
            });
        });

        const todayButton = document.querySelector('.menu button:first-child');
        todayButton.classList.add('active');
        todayButton.style.backgroundColor = '#6c757d';
        todayButton.style.color = '#fff';


        document.querySelector('#date-interval').addEventListener('change', (event) => {
            const dateFrom = document.querySelector('.date-one').value;
            const dateTo = document.querySelector('.date-two').value;
            if (this.currentPeriod === 'interval') {
                this.getOperations(this.currentPeriod, dateFrom, dateTo);
            }
        });
    }

    handleFilterChange(period, button) {
        this.currentPeriod = this.mapPeriod(period);
        //console.log(`Selected period: ${period}, mapped to: ${this.currentPeriod}`); // Логирование

        if (this.currentPeriod === 'interval') {
            const dateFrom = document.querySelector('.date-one').value;
            const dateTo = document.querySelector('.date-two').value;
            this.getOperations(this.currentPeriod, dateFrom, dateTo);
        } else {
            this.getOperations(this.currentPeriod);
        }
        document.querySelectorAll('.menu button').forEach(btn => {
            btn.classList.remove('active');
            btn.style.backgroundColor = '';
            btn.style.color = '';
        });
        button.classList.add('active');
        button.style.backgroundColor = '#6c757d';
        button.style.color = '#fff';
    }

    mapPeriod(period) {
        switch (period) {
            case 'сегодня':
                return 'today';
            case 'неделя':
                return 'week';
            case 'месяц':
                return 'month';
            case 'год':
                return 'year';
            case 'все':
                return 'all';
            case 'интервал':
                return 'interval'
            default:
                return 'today';
        }
    }

    popupDelete() {
        const element = document.getElementsByClassName('delete-popup-open');
        for (let i = 0; i < element.length; i++) {
            element[i].addEventListener('click', () =>  {
                const id = event.currentTarget.getAttribute('data-id');
                document.getElementById('delete-popup').style.display = 'block';
                document.getElementById('overlay').style.display = 'block';

                const deleteButton = document.getElementById('delete-card');
                deleteButton.setAttribute('data-id', id);
            });
        }
    }

    deleteElement() {
        const deleteButton = document.getElementById('delete-card');
        if (deleteButton) {
            deleteButton.addEventListener('click', async () => {
                const id = deleteButton.getAttribute('data-id');
                if (!id) {
                    alert('Не удалось получить идентификатор карточки.');
                    return false;
                }
                const result = await HttpUtils.request(`/operations/${id}`, 'DELETE', true);
                if (result.error || !result.response || (result.response && result.response.error)) {
                    alert('Ошибка при удалении карточки.');
                    return false;
                }
                const trElement = document.querySelector(`tr[data-id="${id}"]`);
                if (trElement) {
                    trElement.remove();
                }


                document.getElementById('delete-popup').style.display = 'none';
                document.getElementById('overlay').style.display = 'none';

                return true;
            });
        }
    }

    notDeleteElement() {
        const notDeleteElement = document.getElementById('not-delete');
        if (notDeleteElement) {
            notDeleteElement.addEventListener('click', () => {
                document.getElementById('delete-popup').style.display = 'none';
                document.getElementById('overlay').style.display = 'none';

            })
        }
    }
}