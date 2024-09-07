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
                document.getElementById('content').style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                document.getElementById('sidebar').style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                document.getElementById('content').style.zIndex = '99';
            });
        }
    }
    notDeleteElement() {
        const notDeleteElement = document.getElementById('not-delete');
        if (notDeleteElement) {
            notDeleteElement.addEventListener('click', () => {
                document.getElementById('delete-popup').style.display = 'none';
                document.getElementById('content').style.backgroundColor = '';
                document.getElementById('sidebar').style.backgroundColor = '';
                document.getElementById('content').style.zIndex = '';
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