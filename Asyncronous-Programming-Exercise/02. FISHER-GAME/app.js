function attachEvents() {
    {

        const elements = {
            catchesDiv: document.querySelector('#catches'),
            anglerInput: document.querySelector('#addForm input.angler'),
            weightInput: document.querySelector('#addForm input.weight'),
            speciesInput: document.querySelector('#addForm input.species'),
            locationInput: document.querySelector('#addForm input.location'),
            baitInput: document.querySelector('#addForm input.bait'),
            captureTimeInput: document.querySelector('#addForm input.captureTime'),
            addBtn: document.querySelector('#addForm button.add'),

            loadBtn: document.querySelector('body > aside > button'),

        };

        const CREATE_URL = "https://fisher-game.firebaseio.com/catches.json";
        const DELETE_URL = "https://fisher-game.firebaseio.com/catches/{catchId}.json";

        elements.addBtn.addEventListener('click', addCatch);
        
        elements.loadBtn.addEventListener('click', listCatches);
        

        async function listCatches() {

            try {
                const response = await fetch(CREATE_URL);
                const data = await response.json();

                elements.catchesDiv.innerHTML = '';

                console.log(data);

                function isEmpty(obj) {
                    for(var key in obj) {
                        if(obj.hasOwnProperty(key))
                            return false;
                    }
                    return true;
                }

                if (!isEmpty(data)) {
                    for (const key in data) {
                        let catchDiv = document.createElement('div');
                        catchDiv.setAttribute('class', 'catch');
                        catchDiv.setAttribute('data-id', key);

                        let hr = createHTMLElement('hr');

                        let updateBtn = createHTMLElement('button', 'update', 'Update', null, {
                            name: 'click',
                            func: updateCatch
                        });
                        let deleteBtn = createHTMLElement('button', 'delete', 'Delete', null, {
                            name: 'click',
                            func: deleteCatch
                        });


                        let anglerLabel = createHTMLElement('label', null, 'Angler');
                        let anglerInput = createHTMLElement('input', 'angler', null, [{
                            k: 'type',
                            v: 'text'
                        }, {
                            k: 'value',
                            v: data[key].angler
                        }]);

                        let weightLabel = createHTMLElement('label', null, 'Weight');
                        let weightInput = createHTMLElement('input', 'weight', null, [{
                            k: 'type',
                            v: 'text'
                        }, {
                            k: 'value',
                            v: data[key].weight
                        }]);

                        let speciesLabel = createHTMLElement('label', null, 'Species');
                        let speciesInput = createHTMLElement('input', 'species', null, [{
                            k: 'type',
                            v: 'text'
                        }, {
                            k: 'value',
                            v: data[key].species
                        }]);

                        let locationLabel = createHTMLElement('label', null, 'Location');
                        let locationInput = createHTMLElement('input', 'location', null, [{
                            k: 'type',
                            v: 'text'
                        }, {
                            k: 'value',
                            v: data[key].location
                        }]);

                        let baitLabel = createHTMLElement('label', null, 'Bait');
                        let baitInput = createHTMLElement('input', 'bait', null, [{
                            k: 'type',
                            v: 'text'
                        }, {
                            k: 'value',
                            v: data[key].bait
                        }]);

                        let captureTimeLabel = createHTMLElement('label', null, 'Capture Time');
                        let captureTimeInput = createHTMLElement('input', 'captureTime', null, [{
                            k: 'type',
                            v: 'text'
                        }, {
                            k: 'value',
                            v: data[key].captureTime
                        }]);

                        catchDiv = appendChildrenToParent([anglerLabel, anglerInput, hr,
                            weightLabel, weightInput, hr,
                            speciesLabel, speciesInput, hr,
                            locationLabel, locationInput, hr,
                            baitLabel, baitInput, hr,
                            captureTimeLabel, captureTimeInput, hr, updateBtn, deleteBtn
                        ], catchDiv);



                        elements.catchesDiv.appendChild(catchDiv);

                    }
                } else {
                    elements.catchesDiv.innerHTML = '<h3>No catches yet! You can add your first one now!</h3>';
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function addCatch() {

            let myCatch = {
                angler: elements.anglerInput.value,
                weight: elements.weightInput.value,
                species: elements.speciesInput.value,
                location: elements.locationInput.value,
                bait: elements.baitInput.value,
                captureTime: elements.captureTimeInput.value
            };

            
            let empty = 0;
            for (const key in myCatch) {
                if (myCatch[key].length === 0) {
                    document.querySelector(`#addForm input.${key}`).style.border = '1px solid red';
                   empty += 1;
                } else {
                    document.querySelector(`#addForm input.${key}`).style.border = '1px solid #ccc';
                }
            }

            if (empty > 0) {
                return;
            }

            const options = {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(myCatch),
                method: "POST"
            };

            try {
                const response = await fetch(CREATE_URL, options);
                const data = await response.json();

                await listCatches();
                elements.anglerInput.value = '';
                elements.weightInput.value = '';
                elements.speciesInput.value = '';
                elements.locationInput.value = '';
                elements.baitInput.value = '';
                elements.captureTimeInput.value = '';

                console.log(data);
            } catch (e) {
                console.error(e);
            }




        }

        async function updateCatch() {

            const catchId = this.parentNode.getAttribute('data-id');
            const url = DELETE_URL.replace('{catchId}', catchId);

            try {

                let [anglerInput,
                    weightInput,
                    speciesInput,
                    locationInput,
                    baitInput,
                    captureTimeInput
                ] = document.querySelectorAll('input');

                let myCatch = {
                    angler: anglerInput.value,
                    weight: weightInput.value,
                    species: speciesInput.value,
                    location: locationInput.value,
                    bait: baitInput.value,
                    captureTime: captureTimeInput.value
                };

                const options = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(myCatch),
                    method: 'PUT'
                };

                const response = await fetch(url, options); // return a PROMISE
                const data = await response.json();

                console.log(data);

            } catch (e) {
                console.error(e);
            }

        }

        async function deleteCatch() {

            const catchId = this.parentNode.getAttribute('data-id');
            const url = DELETE_URL.replace('{catchId}', catchId);

            try {

                const options = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'DELETE'
                };

                const response = await fetch(url, options); // return a PROMISE
                const data = await response.json();

                this.parentNode.remove();

                listCatches();

            } catch (e) {
                console.error(e);
            }

        }


        listCatches();

        function createHTMLElement(tagName, className, textContent, attributes, event) {
            let element = document.createElement(tagName);

            if (className) {
                element.classList.add(className);
            }

            if (textContent) {
                element.textContent = textContent;
            }

            if (attributes) {
                attributes.forEach(a => element.setAttribute(a.k, a.v));
            }

            if (event) {
                element.addEventListener(event.name, event.func)
            }

            return element;
        }

        function appendChildrenToParent(children, parent) {
            children.forEach(child => parent.appendChild(child));
            return parent;
        }
    }
}

attachEvents();