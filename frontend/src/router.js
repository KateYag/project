import {Dashboard} from "./components/dashboard";
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";
import {Income} from "./components/income";
import {Expenses} from "./components/expenses";
import {IncomeExpenses} from "./components/income-expenses";
import {Logout} from "./components/logout";
import {AuthUtils} from "./utils/auth-utils";
import {CreateCardElement} from "./components/create-card-element";
import {EditCardElement} from "./components/edit-card-element";
import {ExpensesCreateCardElement} from "./components/expenses-create-card-element";
import {ExpensesEditCardElement} from "./components/expenses-edit-card-element";
import {CreateCardElementExtended} from "./components/create-card-element-extended";
import {EditCardElementExtended} from "./components/edit-card-element-extended";
import {activateMenuItem, activateNavLinks} from "./utils/menu-utils";
import {activateAccordion} from "./utils/accirdion-utils";
import {updateSidebarBalance} from "./components/layout";

export class Router {
    constructor() {
        this.initEvents();


        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');


        this.routes = [
            {
                route: '/',
                title: 'Главная страница',
                filePathTemplate: '/templates/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    if (this.isAuthenticated()) {
                        new Dashboard(this.openNewRoute.bind(this));
                        updateSidebarBalance();
                    } else {
                        this.redirectToLogin();
                    }
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    if (this.isAuthenticated()) {
                        new Income(this.openNewRoute.bind(this));
                        updateSidebarBalance();
                    } else {
                        this.redirectToLogin();
                    }
                },
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    if (this.isAuthenticated()) {
                        new Expenses(this.openNewRoute.bind(this));
                        updateSidebarBalance();
                    } else {
                        this.redirectToLogin();
                    }
                },
            },
            {
                route: '/income-expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/income-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    if (this.isAuthenticated()) {
                    new IncomeExpenses(this.openNewRoute.bind(this));
                        updateSidebarBalance();
                    } else {
                        this.redirectToLogin();
                    }
                },
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load: () => {

                    new Login(this.openNewRoute.bind(this));
                },

            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/create-card-element',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/create-card-element.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    if (this.isAuthenticated()) {
                    new CreateCardElement(this.openNewRoute.bind(this));
                        updateSidebarBalance();
                    } else {
                        this.redirectToLogin();
                    }
                },
            },
            {
                route: '/edit-card-element',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/edit-card-element.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    if (this.isAuthenticated()) {
                    new EditCardElement(this.openNewRoute.bind(this));
                        updateSidebarBalance();
                    } else {
                        this.redirectToLogin();
                    }
                },
            },
            {
                route: '/expenses-create-card-element',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/expenses-create-card-element.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    if (this.isAuthenticated()) {
                    new ExpensesCreateCardElement(this.openNewRoute.bind(this));
                        updateSidebarBalance();
                    } else {
                        this.redirectToLogin();
                    }
                },
            },
            {
                route: '/expenses-edit-card-element',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/expenses-edit-card-element.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    if (this.isAuthenticated()) {
                    new ExpensesEditCardElement(this.openNewRoute.bind(this));
                        updateSidebarBalance();
                    } else {
                        this.redirectToLogin();
                    }
                },
            },
            {
                route: '/create-card-element-extended',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/create-card-element-extended.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    if (this.isAuthenticated()) {
                    new CreateCardElementExtended(this.openNewRoute.bind(this));
                        updateSidebarBalance();
                    } else {
                        this.redirectToLogin();
                    }
                },
            },
            {
                route: '/edit-card-element-extended',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/edit-card-element-extended.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    if (this.isAuthenticated()) {
                    new EditCardElementExtended(this.openNewRoute.bind(this));
                        updateSidebarBalance();
                    } else {
                        this.redirectToLogin();
                    }
                },
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                },
            },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
        activateNavLinks();
    }


    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {


        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }




    isAuthenticated() {
        const userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
        return userInfo !== null;
    }


    redirectToLogin() {
        this.openNewRoute('/login');
    }


    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }

                let contentBlock = this.contentPageElement;
                const sidebar = document.getElementById('sidebar');

            if (newRoute.route === '/login' || newRoute.route === '/sign-up') {
                if (sidebar) {
                    sidebar.style.display = 'none';
                }
            } else if (newRoute.useLayout && !sidebar) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    activateMenuItem(newRoute);
                    activateAccordion();

                    this.profileNameElement = document.getElementById('profile-name');
                    let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                    if (userInfo) {
                        userInfo = JSON.parse(userInfo);
                        if (userInfo.name && userInfo.lastName) {
                            this.profileNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
                        }
                    }

                } else if (sidebar) {
                    sidebar.style.display = 'block';
                    contentBlock = document.getElementById('content-layout');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            activateMenuItem(newRoute);
            activateAccordion();
                // }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }



        }
    }


}