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
                    new Dashboard();
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Income(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/income-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpenses();
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
                    new CreateCardElement(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/edit-card-element',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/edit-card-element.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditCardElement(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses-create-card-element',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/expenses-create-card-element.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesCreateCardElement(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses-edit-card-element',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/expenses-edit-card-element.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesEditCardElement(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/create-card-element-extended',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/create-card-element-extended.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateCardElementExtended(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/edit-card-element-extended',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/edit-card-element-extended.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditCardElementExtended(this.openNewRoute.bind(this));
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
        this.activateNavLinks();
    }
    activateNavLinks() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {

                document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));


                this.classList.add('active');
            });
        });
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
    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }
            if (newRoute.filePathTemplate) {
                let contentBlock =  this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML =  await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');

                    this.profileNameElement = document.getElementById('profile-name');
                    let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                    if (userInfo) {
                        userInfo = JSON.parse(userInfo);
                        if (userInfo.name && userInfo.lastName) {
                            this.profileNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
                        }
                    }

                    this.activateMenuItem(newRoute);

                    //contentLayoutPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                }
                contentBlock.innerHTML =  await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
            this.activateAccordion();

        }
    }

    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');

            } else {
                item.classList.remove('active');
            }
        });


        document.querySelectorAll('.sidebar .nav-link.active span').forEach(span => {
            span.style.color = 'white';
        });



    }

    activateAccordion() {

            const currentPath = window.location.pathname;
            const accordionCollapse = document.getElementById('panelsStayOpen-collapseOne');
            const accordionButton = document.querySelector('[data-bs-target="#panelsStayOpen-collapseOne"]');
            const categoriesTextElement = document.querySelector('#panelsStayOpen-headingOne span');
            if (accordionCollapse && accordionButton && categoriesTextElement) {
            if (currentPath === '/income' || currentPath === '/expenses') {
                accordionCollapse.classList.add('show');
                accordionButton.classList.remove('collapsed');
                accordionButton.setAttribute('aria-expanded', 'true');
                categoriesTextElement.classList.add('text-white');


            } else {
                accordionCollapse.classList.remove('show');
                accordionButton.classList.add('collapsed');
                accordionButton.setAttribute('aria-expanded', 'false');
                categoriesTextElement.classList.remove('text-white');
            }
            }





        accordionButton.addEventListener('click', function() {
            const isCollapsed = accordionButton.classList.contains('collapsed');


            if (!isCollapsed) {
                categoriesTextElement.classList.add('text-white');
            } else {

                categoriesTextElement.classList.remove('text-white');
            }

            if (!isCollapsed) {
                document.querySelectorAll('.sidebar .nav-link').forEach(item => {
                    const href = item.getAttribute('href');
                    if (href === '/' || href === '/income-expenses') {
                        item.classList.remove('active');
                        item.querySelector('span').style.color = '';

                    }
                });
            }
        });

    }



}