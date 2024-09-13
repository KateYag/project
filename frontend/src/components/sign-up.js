import {AuthUtils} from "../utils/auth-utils";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.nameElement = document.getElementById('name');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.commonErrorElement = document.getElementById('common-error');
        this.commonErrorEmailElement = document.getElementById('common-error-email');
        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this))
    }
    validateForm() {
        let isValid = true;

        if (this.nameElement.value && this.nameElement.value.match( /^[А-ЯЁ][а-яё]*(?: [А-ЯЁ][а-яё]*)+$/)) {
            this.nameElement.classList.remove('is-invalid');
        } else {
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }
    async signUp() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {
            const nameParts = this.nameElement.value.split(' ');
            const lastName = nameParts[0] || '';
            const firstName = nameParts[1] || '';
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    //name: this.nameElement.value,
                    name: firstName,
                    lastName: lastName,
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    passwordRepeat: this.passwordRepeatElement.value,

                })
            });
            const result = await response.json();

            // if (result) {
            //     if (result.error || result.user.id || result.user.name || result.user.lastName || result.user.email) {
            //         this.commonErrorElement.style.display = 'block';
            //         return;
            //     }
            //     else {
            //         this.openNewRoute('/login');
            //     }
            // }
            if (response.ok) {
                if (result.user) {
                    this.openNewRoute('/login');
                } else {
                    this.commonErrorElement.style.display = 'block';
                }
            } else {
                if (result.message) {
                    if (result.message.includes('email')) {
                        this.commonErrorEmailElement.style.display = 'block';

                    } else {
                        this.commonErrorElement.style.display = 'block';
                        this.commonErrorElement.textContent = result.message;
                    }
                } else {
                    this.commonErrorElement.style.display = 'block';
                    this.commonErrorElement.textContent = 'Произошла ошибка при регистрации.';
                }
            }


            // AuthUtils.setAuthInfo( result.tokens.accessToken, result.tokens.refreshToken, {
            //     id: result.user.id,
            //     name: result.user.name,
            //     lastName: result.user.lastName
            // });
            //  localStorage.setItem('lastName', lastName);
            //  localStorage.setItem('firstName', firstName);
            // //localStorage.setItem('accessToken', result.tokens.accessToken);
            // //localStorage.setItem('refreshToken', result.tokens.refreshToken);
            // localStorage.setItem('userInfo', JSON.stringify({
            //     id: result.user.id,
            //     name: result.user.name,
            //     lastName: result.user.lastName
            // }));
            // this.openNewRoute('/');

        }

    }


}