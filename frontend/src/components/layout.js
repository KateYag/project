import {HttpUtils} from "../utils/http-utils";

export async function updateSidebarBalance(openNewRoute) {

    const result = await HttpUtils.request('/balance');
    if(result.redirect) {
        return  openNewRoute(result.redirect);
    }
    if (result.error || !result.response || (result.response && result.response.error)) {
        return alert('Возникла ошибка при запросе баланса.');
    }

    const balance = result.response.balance;
    showBalance(balance);

}

export function showBalance(balance) {

    const balanceElement = document.getElementById('sidebar-balance');

    if (balanceElement) {
        balanceElement.textContent = balance + ' $'; // Обновляем текст баланса
    }
}


