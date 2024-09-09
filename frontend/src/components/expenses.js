export class Expenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.popupDelete();
        this.createElement();
        this.editElement();
        this.notDeleteElement();
    }
    popupDelete() {
        const element = document.getElementsByClassName('delete-popup-open');
        for (let i = 0; i < element.length; i++) {
            element[i].addEventListener('click', () =>  {
                document.getElementById('delete-popup').style.display = 'block';
                document.getElementById('overlay').style.display = 'block';
            });
        }
    }
    notDeleteElement() {
        const notDeleteElement = document.getElementById('not-delete');
        if (notDeleteElement) {
            notDeleteElement.addEventListener('click', () => {
                document.getElementById('delete-popup').style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
            })
        }
    }

    createElement() {
        const createCardElement = document.getElementById('create-card');
        if (createCardElement) {
            createCardElement.addEventListener('click', () => {
                this.openNewRoute('/expenses-create-card-element');
            })
        }
    }
    editElement() {
        const editCardElement = document.getElementsByClassName('edit-card');
        for (let i = 0; i < editCardElement.length; i++) {
            editCardElement[i].addEventListener('click', () =>  {
                this.openNewRoute('/expenses-edit-card-element');
            });
        }


    }
}