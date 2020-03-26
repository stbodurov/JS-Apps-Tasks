(() => {
    const elements = {

        loadBtn: document.querySelector('#btnLoadTowns'),
        townInput: document.querySelector('#towns'),
        townWrapper: document.querySelector('#root')
    }

    elements.loadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (elements.townInput.value.trim() === '') {
            alert('You have not entered any towns.')
            return;
        }

        let towns = elements.townInput.value.split(',').map(x => x.trim());
        
        fetch('./template.hbs').then(r => r.text())
            .then((templateHbs) => {

                const template = Handlebars.compile(templateHbs);

                const resultHTML = template({
                    towns
                });

                elements.townWrapper.innerHTML = resultHTML;
            });

            elements.townInput.value = '';

    });
})();