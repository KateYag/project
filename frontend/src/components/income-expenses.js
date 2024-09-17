import {HttpUtils} from "../utils/http-utils";

export class IncomeExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        //this.getIncome().then();
        //this.getExpenses().then();
        this.getOperations().then();
        this.popupDelete();
        this.notDeleteElement();
    }
    async getOperations() {
        const result = await HttpUtils.request('/operations');
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
        for (let i = 0; i < result.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;
            let typeHtml = null;
            switch (result[i].type) {
                case 'expense':
                    typeHtml = '<span class="text-danger">расход</span>'
                    break;
                case 'income':
                    typeHtml = '<span class="text-success">доход</span>'
                    break;
            }
            trElement.insertCell().innerText = typeHtml;
            trElement.insertCell().innerText = result.category;
            trElement.insertCell().innerText = result.amount;
            trElement.insertCell().innerText = result.date;
            trElement.insertCell().innerText = result.comment;
            trElement.insertCell().innerHTML = '<div class="link">' +
                '<a href="javascript:void(0)" class="delete-popup-open"><span class="fa fa-trash"></span></a>' +
                '<a href="/edit-card-element-extended/edit?id=' + result[i].id + '" class="delete-popup-open"><span class="fa fa-pencil"></span></a>' +
            '</div>';
            recordsElement.appendChild(trElement);



        }

        this.popupDelete();
    }


    popupDelete() {
        const element = document.getElementsByClassName('delete-popup-open');
        for (let i = 0; i < element.length; i++) {
            element[i].addEventListener('click', () =>  {
                document.getElementById('delete-popup').style.display = 'block';
                document.getElementById('overlay').style.display = 'block';
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