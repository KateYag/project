export class Income {
    constructor() {
        this.popupDelete();
    }
    popupDelete() {
        document.getElementById('delete-popup-open').addEventListener('click', function ()  {
          document.getElementById('delete-popup').style.display = 'block';
          document.getElementById('content').style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          document.getElementById('sidebar').style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          document.getElementById('content').style.zIndex = '99';
        });
    }
}