import {HttpUtils} from "../utils/http-utils";

export class CreateCardElement {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.createElement();
        this.notCreateElement();
    }

    createElement() {
        const createButton = document.getElementById('create-new-card');
        if (createButton) {
            createButton.addEventListener('click', async () => {
                const title = document.querySelector('.input-create-card').value;
                if (title.trim() !== '') {
                    // Отправляем POST-запрос для создания новой карточки
                   const success = await this.saveCardToServer(title);
                    if (success) {
                        // Возвращаемся на страницу доходов после успешного создания
                        this.openNewRoute('/income');
                    }  else {
                        alert('Не удалось создать карточку. Попробуйте снова.');
                    }
                }  else {
                alert('Название карточки не должно быть пустым.');
            }
            });
        }
    }
    async saveCardToServer(title) {
        const result = await HttpUtils.request('/categories/income', 'POST', true,{ title });
        if (result.error || !result.response || (result.response && result.response.error)) {
            alert('Ошибка при создании карточки.');
            return false;
        }
        return true;
    }


    notCreateElement() {
        const notCreateCardElement = document.getElementById('not-create-new-card');
        if (notCreateCardElement) {
            notCreateCardElement.addEventListener('click', () => {
                this.openNewRoute('/income');
            })
        }
    }

}