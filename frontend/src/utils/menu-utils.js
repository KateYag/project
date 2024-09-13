 export function activateNavLinks() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function () {

                document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));


                this.classList.add('active');
            });
        });
    }


 export function activateMenuItem(route) {
     // Сначала сбрасываем все активные стили
     document.querySelectorAll('.sidebar .nav-link').forEach(item => {
         item.classList.remove('active');
         item.querySelector('span').style.color = ''; // Сброс цвета текста
     });

     // Устанавливаем активные стили для текущего маршрута
     document.querySelectorAll('.sidebar .nav-link').forEach(item => {
         const href = item.getAttribute('href');
         if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
             item.classList.add('active');
             item.querySelector('span').style.color = 'white'; // Установка цвета текста для активного элемента
         }
     });
 }
