
import { monkeys } from './monkeys.js';

(async () => {
    Handlebars.registerPartial(
        'monkey',
        await fetch('./monkey-template.hbs').then((r) => r.text())
    );

    const templateSrc = await fetch('./monkeys-template.hbs').then((r) => r.text());
    const template = Handlebars.compile(templateSrc);

    const resultHTML = template({ monkeys });

    document.querySelector('section').innerHTML += resultHTML;

    document.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
            const pInfo = btn.parentNode.querySelector('p');
            const { display } = pInfo.style;

            if (display === "none") {
                pInfo.style.display = "block"
                btn.innerText = "HIDE";
            } else {
                pInfo.style.display = "none";
                btn.innerText = "INFO";
            }
        });
    })
})();