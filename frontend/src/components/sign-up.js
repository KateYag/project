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
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: this.nameElement.value,
                    email: this.emailElement.value,
                    password: this.passwordElement.value,

                })
            });
            const result = await response.json();

            if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.id || !result.user.name || !result.user.lastName) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo( result.tokens.accessToken, result.tokens.refreshToken, {
                id: result.user.id,
                name: result.user.name,
                lastName: result.user.lastName
            });
            // localStorage.setItem('accessToken', result.tokens.accessToken);
            // localStorage.setItem('refreshToken', result.tokens.refreshToken);
            // localStorage.setItem('userInfo', JSON.stringify({
            //     id: result.user.id,
            //     name: result.user.name,
            //     lastName: result.user.lastName
            // }));
            this.openNewRoute('/');

        }

    }


}