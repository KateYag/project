import {HttpUtils} from "../utils/http-utils";

export class ExpensesEditCardElement {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.updateCardTitle();
        this.notUpdateCardTitle();
    }

    updateCardTitle(){

        const editInput = document.querySelector('.input-create-card');
        const cardTitle = sessionStorage.getItem('editCardTitle');
        const cardId = sessionStorage.getItem('editCardId');
        if (cardTitle && editInput) {
            editInput.value = cardTitle;
        }

        document.querySelector('.btn-success.button').addEventListener('click', async () => {
            const newCategoryName = document.querySelector('.input-create-card').value;

            const result = await HttpUtils.request(`/categories/expense/${cardId}`, 'PUT', true, { id: cardId, title: newCategoryName });
            if (result.error) {
                throw new Error('Ошибка при обновлении карточки.');
            }
            this.openNewRoute('/expenses');


        });

    }

    notUpdateCardTitle() {
        document.querySelector('.btn-danger.button').addEventListener('click', () => {
            this.openNewRoute('/expenses');

        })
    }
}