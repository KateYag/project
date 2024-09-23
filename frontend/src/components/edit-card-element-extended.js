import {HttpUtils} from "../utils/http-utils";

export class EditCardElementExtended {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.init();
        this.notUpdateCardTitle();
        this.setupEventListeners();

    }

    async init() {
        this.loadEditData().then();
        this.updateData().then();
    }
    async loadEditData() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            alert('Не удалось получить идентификатор операции');
            return;
        }

        const result = await HttpUtils.request(`/operations/${id}`);
        if (result.error || !result.response || (result.response && result.response.error)) {
            alert('Ошибка при загрузке данных для редактирования.');
            return;
        }
        const operation = result.response;

        document.getElementById('type-select').value = operation.type;
        document.querySelector('input[placeholder="Сумма в $..."]').value = operation.amount || '';
        document.querySelector('input[placeholder="Дата..."]').value = operation.date || '';
        document.querySelector('input[placeholder="Комментарий..."]').value = operation.comment || '';

        // Динамическая загрузка категорий в зависимости от типа операции (доход или расход)
        await this.loadCategories(operation.type, operation.category_id);
    }

    async loadCategories(type, selectedCategory = '') {
        let categoryUrl = `/categories/${type}`;
        let result = await HttpUtils.request(categoryUrl);

        if (result.error || !result.response || (result.response && result.response.error)) {
            alert('Ошибка при загрузке категорий.');
            return;
        }

        const categories = result.response;
        const categorySelect = document.getElementById('category-select');
        categorySelect.innerHTML = '';


        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.innerText = category.title;
            categorySelect.appendChild(option);
        });

        console.log('Selected Category:', selectedCategory);
        if (selectedCategory) {
            categorySelect.value = selectedCategory;
        }
    }

    setupEventListeners() {
        document.getElementById('type-select').addEventListener('change', async (event) => {
            const selectedType = event.target.value;
            if (selectedType) {
                await this.loadCategories(selectedType);
            }
        });
    }

    async updateData() {
        document.querySelector('.btn.btn-success.button').addEventListener('click', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');

            const updatedData = {
                type: document.getElementById('type-select').value,
                category_id:  document.getElementById('category-select').value,
                amount: document.querySelector('input[placeholder="Сумма в $..."]').value,
                date: document.querySelector('input[placeholder="Дата..."]').value,
                comment: document.querySelector('input[placeholder="Комментарий..."]').value
            };

            const result = await HttpUtils.request(`/operations/${id}`, 'PUT', true, updatedData);
            if (result.error || !result.response || (result.response && result.response.error)) {
                alert('Ошибка при обновлении данных.');
                return;
            }
            this.openNewRoute('/income-expenses');
        });

    }
    notUpdateCardTitle() {
        document.querySelector('.btn-danger.button').addEventListener('click', () => {
            this.openNewRoute('/income-expenses');
        });
    }
}