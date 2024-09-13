export function activateAccordion() {

    // const currentPath = window.location.pathname;
    const accordionCollapse = document.getElementById('panelsStayOpen-collapseOne');
    const accordionButton = document.querySelector('[data-bs-target="#panelsStayOpen-collapseOne"]');
    const categoriesTextElement = document.querySelector('#panelsStayOpen-headingOne span');

    if (accordionCollapse && accordionButton && categoriesTextElement) {
        const currentPath = window.location.pathname;
        const shouldAccordionBeOpen = (currentPath === '/income' || currentPath === '/expenses');

        if (shouldAccordionBeOpen) {
            if (!accordionCollapse.classList.contains('show')) {
                accordionCollapse.classList.add('show');
            }
            accordionButton.classList.remove('collapsed');
            accordionButton.setAttribute('aria-expanded', 'true');
            categoriesTextElement.classList.add('text-white');


        } else {
            if (accordionCollapse.classList.contains('show')) {
                accordionCollapse.classList.remove('show');
            }

            accordionButton.classList.add('collapsed');
            accordionButton.setAttribute('aria-expanded', 'false');
            categoriesTextElement.classList.remove('text-white');
        }

        accordionButton.addEventListener('click', function () {
            const isCollapsed = accordionButton.classList.contains('collapsed');


            if (!isCollapsed) {
                categoriesTextElement.classList.add('text-white');
            } else {

                categoriesTextElement.classList.remove('text-white');
            }

            //if (!isCollapsed) {
            document.querySelectorAll('.sidebar .nav-link').forEach(item => {
                const href = item.getAttribute('href');
                if (href === '/' || href === '/income-expenses') {
                    item.classList.remove('active');
                    item.querySelector('span').style.color = '';

                }
            });
            // }
        });

    } else {
        return;
    }
}