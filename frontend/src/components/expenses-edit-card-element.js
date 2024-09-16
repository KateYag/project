export class ExpensesEditCardElement {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.updateCardTitle();
        this.notUpdateCardTitle();
    }

    updateCardTitle(){

        const editInput = document.querySelector('.input-create-card');
        const cardTitle = sessionStorage.getItem('editCardTitle'); // Получаем сохраненное название
        if (cardTitle && editInput) {
            editInput.value = cardTitle; // Устанавливаем значение в инпут
        }

        document.querySelector('.btn-success.button').addEventListener('click', () => {
            const newCategoryName = document.querySelector('.input-create-card').value;
            const cardIndex = sessionStorage.getItem('editCardIndex'); // Получаем индекс карточки

            // Возвращаемся на страницу доходов
            this.openNewRoute('/expenses');

            // После возврата обновляем карточку на странице
            setTimeout(() => { // Даем немного времени для перехода
                const cardToUpdate = document.querySelectorAll('.card .card-title')[cardIndex];
                if (cardToUpdate) {
                    cardToUpdate.textContent = newCategoryName;
                }
            }, 100); // Задержка для завершения перехода
        });

    }

    notUpdateCardTitle() {
        document.querySelector('.btn-danger.button').addEventListener('click', () => {
            this.openNewRoute('/expenses');

        })
    }
}