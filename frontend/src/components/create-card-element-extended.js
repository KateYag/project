export class CreateCardElementExtended {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this. setupEventListeners();
    }
    setupEventListeners() {

        document.getElementById('type-select').addEventListener('change', (event) => {
            this.updateCategories(event.target.value);
        });

        // Обработчик для кнопки создания
        document.getElementById('create-button').addEventListener('click', () => {
            this.createTransaction();
        });

        // Обработчик для кнопки отмены
        document.getElementById('cancel-button').addEventListener('click', () => {
            this.openNewRoute('/income'); // Переход на страницу доходов
        });
    }

    updateCategories(type) {
        const categorySelect = document.getElementById('category-select');
        categorySelect.innerHTML = '<option value="">Выберите категорию...</option>';

        fetch(`http://localhost:3000/api/categories/income`)
            .then(response => response.json())
            .then(data => {
                data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Ошибка при загрузке категорий:', error);
            });
    }



}