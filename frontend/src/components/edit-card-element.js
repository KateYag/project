import {HttpUtils} from "../utils/http-utils";

export class EditCardElement {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.updateCardTitle();
        this.notUpdateCardTitle();
    }

    async updateCardTitle() {
        const editInput = document.querySelector('.input-create-card');
        let cardTitle = sessionStorage.getItem('editCardTitle');
        const cardId = sessionStorage.getItem('editCardId');
        if (cardTitle && editInput) {
            editInput.value = cardTitle;
        }


        document.querySelector('.btn-success.button').addEventListener('click', async () => {
            const newCategoryName = editInput.value;

            const result = await HttpUtils.request(`/categories/income/${cardId}`, 'PUT', true, { id: cardId, title: newCategoryName });
            if (result.error) {
                throw new Error('Ошибка при обновлении карточки.');
            }

                this.openNewRoute('/income');


        });
    }

    notUpdateCardTitle() {
        document.querySelector('.btn-danger.button').addEventListener('click', () => {
            this.openNewRoute('/income');
        });
    }
}
