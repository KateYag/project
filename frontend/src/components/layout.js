import {AuthUtils} from "../utils/auth-utils";

export async function updateSidebarBalance() {
    const accessToken = AuthUtils.getAccessToken();
    console.log('Access Token:', accessToken);

    try {
        const response = await fetch('http://localhost:3000/api/balance', {
            method: 'GET',
            headers: {
                'Authorization': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const balanceElement = document.getElementById('sidebar-balance');

        if (balanceElement) {
            balanceElement.textContent = `Баланс: ${data.balance}`;
        }
    } catch (error) {
        console.error('Ошибка при получении баланса:', error);
        const balanceElement = document.getElementById('sidebar-balance');
        if (balanceElement) {
            balanceElement.textContent = 'Не удалось получить баланс';
        }
    }
}



