import {HttpUtils} from "../utils/http-utils";

export class Income {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getIncome().then();
        // this.popupDelete();
        // this.createElement();
         //this.editElement();
        this.notDeleteElement();
        this.deleteElement();

    }


    async getIncome() {
        const result = await HttpUtils.request('/categories/income/');
           if(result.redirect) {
              return  this.openNewRoute(result.redirect);
           }
        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе карточек дохода.');
        }

        this.showCard(result.response);
    }

    showCard(result) {
        console.log(result)
        const cardsContainer = document.querySelector('.cards');
        result.forEach((category) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.setAttribute('data-id', category.id);
            cardElement.setAttribute('id', `card-${category.id}`);
            //cardElement.id = `card-${category.id}`;
            cardElement.innerHTML = `
            <div class="card-body">
                <h5 class="card-title mb-3">${category.title}</h5>
                <a href="javascript:void(0)" class="btn btn-primary edit-card" data-id="${category.id}">Редактировать</a>
                <a href="javascript:void(0)" class="btn btn-danger delete-popup-open" data-id="${category.id}">Удалить</a>
            </div>
        `;

            cardsContainer.appendChild(cardElement);
        });
        const createCard = document.createElement('div');
        createCard.classList.add('card', 'plus');
        createCard.innerHTML = `
        <div class="card-body" id="create-card">
            <i class="fa fa-plus translate-middle"></i>
        </div>
    `;
        cardsContainer.appendChild(createCard);

        this.createElement();
        this.editElement();
        this.popupDelete();
    }
    popupDelete() {
        const element = document.getElementsByClassName('delete-popup-open');
        for (let i = 0; i < element.length; i++) {
           element[i].addEventListener('click', (event) =>  {
               const id = event.target.getAttribute('data-id');
               document.getElementById('delete-popup').style.display = 'block';
               document.getElementById('overlay').style.display = 'block';

               const deleteButton = document.getElementById('delete-card');
               deleteButton.setAttribute('data-id', id);
           });
        }
    }

    createElement() {
        const createCardElement = document.getElementById('create-card');
        if (createCardElement) {
            createCardElement.addEventListener('click', () => {
                this.openNewRoute('/create-card-element');
            })
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
    deleteElement() {
        const deleteButton  = document.getElementById('delete-card');
        if (deleteButton) {
            deleteButton.addEventListener('click', async () => {
                const id = deleteButton.getAttribute('data-id');
                if (!id) {
                    alert('Не удалось получить идентификатор карточки.');
                    return false;
                }
                const result = await HttpUtils.request(`/categories/income/${id}`, 'DELETE', true);
                if (result.error || !result.response || (result.response && result.response.error)) {
                    alert('Ошибка при удалении карточки.');
                    return false;
                }
                const card = document.getElementById(`card-${id}`);
                if (card) {
                    card.remove();
                }
                document.getElementById('delete-popup').style.display = 'none';
                document.getElementById('overlay').style.display = 'none';

                return true;

            })
        }
    }
    editElement() {
        const editCardElement = document.getElementsByClassName('edit-card');
        for (let i = 0; i < editCardElement.length; i++) {
            editCardElement[i].addEventListener('click', (event) =>  {
                const cardElement = event.target.closest('.card');
                const cardTitle = cardElement.querySelector('.card-title').textContent;
                const cardId = cardElement.getAttribute('data-id');
                sessionStorage.setItem('editCardTitle', cardTitle);
                sessionStorage.setItem('editCardId', cardId);


                this.openNewRoute('/edit-card-element');
            });
        }

    }
}