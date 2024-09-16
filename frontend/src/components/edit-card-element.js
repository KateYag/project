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
            editInput.value = cardTitle; // Устанавливаем значение в инпут
        }

        // Используем обратные кавычки для шаблонной строки
        document.querySelector('.btn-success.button').addEventListener('click', async () => {
            const newCategoryName = document.querySelector('.input-create-card').value;

            const result = await HttpUtils.request(`/income/${cardId}`, 'PUT', true,{
                id: cardId,
                title: newCategoryName
            });
            if (result.error) {
                throw new Error('Ошибка при обновлении карточки.');
            }
                // const response = await fetch(`http://localhost:3000/api/categories/income/${cardId}`, {
                //     method: 'PUT',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({
                //         title: newCategoryName,
                //     }),
                // });
                //
                // if (!response.ok) {
                //     throw new Error('Ошибка при обновлении карточки.');
                // }

                // Возвращаемся на страницу доходов
                this.openNewRoute('/income');


        });
    }

    notUpdateCardTitle() {
        document.querySelector('.btn-danger.button').addEventListener('click', () => {
            this.openNewRoute('/income');
        });
    }
}
