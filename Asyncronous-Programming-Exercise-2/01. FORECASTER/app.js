function attachEvents() {

    const BASE_URL = "https://judgetests.firebaseio.com/locations.json";
    const WEATHER_URL = "https://judgetests.firebaseio.com/forecast/{status}/{code}.json";

    errH1 = createHTMLElement('h1', null, 'Error');
    errH1.style.display = 'none';

    const elements = {
        locationInput: document.querySelector("#location"),
        button: document.querySelector("#submit"),
        notificationHeading: document.querySelector('h1.notification'),
        currentDiv: document.querySelector('#current'),
        upcomingDiv: document.querySelector('#upcoming'),
        forecastWrapper: document.querySelector('#forecast')
    };

    const symbols = {
        "s": "☀",
        "p": "⛅",
        "o": "☁",
        "r": "☂",
        "d": "°"
    };

    
    const errHdlr = () => {
        elements.forecastWrapper.appendChild(errH1);
        errH1.style.display = 'block';
        errH1.style.textAlign = 'center';

        elements.locationInput.style.border = '1px solid red';

        elements.forecastWrapper.style.display = "block";
        elements.currentDiv.style.display = "none";
        elements.upcomingDiv.style.display = "none";
    };

    const jsonMiddleware = (r) => r.json();

    elements.button.addEventListener("click", getLocationValue);

    function getLocationValue() {
        elements.locationInput.style.border = '1px solid #ccc';


        const location = elements.locationInput.value.trim();

        fetch(BASE_URL)
            .then(jsonMiddleware)
            .then((data) => {
                const {
                    name,
                    code
                } = data.find((o) => o.name === location);

                const CURRENT_TODAY_URL = WEATHER_URL.replace('{status}/{code}', `today/${code}`);
                const CURRENT_UPCOMING_URL = WEATHER_URL.replace('{status}/{code}', `upcoming/${code}`);

                elements.notificationHeading.textContent = '';

                Promise.all([
                        fetch(CURRENT_TODAY_URL).then(jsonMiddleware),
                        fetch(CURRENT_UPCOMING_URL).then(jsonMiddleware)
                    ])
                    .then(showWeatherLocation)
                    .catch(errHdlr)
            })
            .catch(errHdlr)
    }

    function showWeatherLocation([todayData, upcomingData]) {

        const {
            condition,
            high,
            low
        } = todayData.forecast;

        let forecastsDiv = createHTMLElement('div', ['forecasts']);
        let symbolSpan = createHTMLElement('span', ['condition', 'symbol'], symbols[condition[0].toLowerCase()]);
        let conditionSpan = createHTMLElement('span', ['condition']);

        let forecastFirstDataSpan = createHTMLElement('span', ['forecast-data'], todayData.name);

        let degreesInfo = `${low}${symbols.d}/${high}${symbols.d}`;
        let forecastSecondDataSpan = createHTMLElement('span', ['forecast-data'], degreesInfo);

        let forecastThirdDataSpan = createHTMLElement('span', ['forecast-data'], condition);

        conditionSpan.appendChild(forecastFirstDataSpan);
        conditionSpan.appendChild(forecastSecondDataSpan);
        conditionSpan.appendChild(forecastThirdDataSpan);

        forecastsDiv.appendChild(symbolSpan);
        forecastsDiv.appendChild(conditionSpan);
        elements.currentDiv.innerHTML = '';
        elements.currentDiv.appendChild(forecastsDiv);

        showUpcomingWeatherLocation(upcomingData);
    }

    function showUpcomingWeatherLocation({
        forecast,
        name}) {
        let forecastInfoDiv = createHTMLElement('div', ['forecast-info']);

        forecast.forEach(({
            condition,
            high,
            low
        }) => {
            let upcomingSpan = createHTMLElement('span', ['upcoming']);

            let locationSpan = createHTMLElement('span', ['location-name'], name);

            let symbolSpan = createHTMLElement('span', ['symbol'], symbols[condition[0].toLowerCase()]);

            let degreeseInfo = `${low}${symbols.d}/${high}${symbols.d}`;
            let degreeseSpan = createHTMLElement('span', ['forecast-data'], degreeseInfo);

            let conditionSpan = createHTMLElement('span', ['forecast-data'], condition);

            upcomingSpan.appendChild(locationSpan);
            upcomingSpan.appendChild(symbolSpan);
            upcomingSpan.appendChild(degreeseSpan);
            upcomingSpan.appendChild(conditionSpan);

            forecastInfoDiv.appendChild(upcomingSpan);
        });

        elements.upcomingDiv.innerHTML = '';
        elements.upcomingDiv.appendChild(forecastInfoDiv);

        errH1.style.display = 'none';

        elements.forecastWrapper.style.display = "block";
        elements.currentDiv.style.display = "block";
        elements.upcomingDiv.style.display = "block";
    }

}

function createHTMLElement(tagName, classNames, textContent) {
    let element = document.createElement(tagName);

    if (classNames) {
        element.classList.add(...classNames);
    }

    if (textContent) {
        element.textContent = textContent;
    }

    return element;
}

attachEvents();