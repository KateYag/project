import {HttpUtils} from "../utils/http-utils";
import {IncomeExpenses} from "./income-expenses";

export class CreateCardElementExtended {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.setupEventListeners();
    }

    setupEventListeners() {

        document.getElementById('type-select').addEventListener('change', async (event) => {
            const selectedType = event.target.value;
            if (selectedType) {
                const url = `/categories/${selectedType}`;
                try {
                    const result = await HttpUtils.request(url);
                    if (result.error || !result.response || (result.response && result.response.error)) {
                        return alert('Ошибка при получении категорий.');
                    }
                    this.populateCategories(result.response); // для заполнения селектора категорий
                } catch (error) {
                    console.error('Ошибка запроса категорий:', error);
                }
            }
        });

        // Обработчик для кнопки создания
        document.getElementById('create-button').addEventListener('click', () => {
            this.createTransaction();
        });

        //Обработчик для кнопки отмены
        document.getElementById('cancel-button').addEventListener('click', () => {
            this.openNewRoute('/income-expenses');
        });
    }

    async createTransaction() {
        const type = document.getElementById('type-select').value;
        const categorySelect = document.getElementById('category-select');
        const category_id = parseInt(categorySelect.value);
        const amount = parseInt(document.querySelector('input[type="number"]').value);
        const date = document.querySelector('input[type="date"]').value;
        const comment = document.querySelector('input[type="text"]').value;

        // Проверка обязательных полей

        if (!type) {
            return alert('Выберите тип операции.');
        }
        if (!category_id) {
            return alert('Выберите категорию.');
        }
        if (!amount || isNaN(amount)) {
            return alert('Введите корректную сумму.');
        }
        if (!date) {
            return alert('Выберите дату.');
        }

        //
        // const data = {
        //     type,
        //     amount,
        //     date,
        //     comment: comment || "",
        //     category_id
        //
        // };
        // console.log('Data being sent:', data);

console.log({type, amount, date, comment, category_id});
        const result = await HttpUtils.request('/operations', 'POST', true, {type, amount, date, comment, category_id});
        console.log(result.response);
        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Ошибка при создании операции.');
        }


        // Обновление таблицы

        const incomeExpenses = new IncomeExpenses(this.openNewRoute);
        await incomeExpenses.getOperations(incomeExpenses.currentPeriod);


    }

    populateCategories(categories) {
        const categorySelect = document.getElementById('category-select');
        categorySelect.innerHTML = ''; // Очищаем селектор

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Категория...';
        categorySelect.appendChild(defaultOption);

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;  // Используем id категории
            option.textContent = category.title; // Отображаем название категории
            categorySelect.appendChild(option);
        });
    }

}