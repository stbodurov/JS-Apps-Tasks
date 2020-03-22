function attachEvents() {

    const loadBtn = document.querySelector('#btnLoad');
    const phoneBookUL = document.querySelector('#phonebook');

    const personInput = document.querySelector('#person');
    const phoneInput = document.querySelector('#phone');

    const createBtn = document.querySelector('#btnCreate');


    const GET_URL = "https://phonebook-nakov.firebaseio.com/phonebook.json";
    const DELETE_URL = "https://phonebook-nakov.firebaseio.com/phonebook/<key>.json";

    createBtn.addEventListener('click', createContact);
    loadBtn.addEventListener('click', loadContacts);

    async function createContact() {
        if (personInput.value.length > 0) {
            let contact = {
                person: personInput.value,
                phone: phoneInput.value
            }

            const options = {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contact),
                method: "POST"
            };

            try {
                const response = await fetch(GET_URL, options);
                const data = await response.json();

                personInput.value = "";
                phoneInput.value = "";

                loadContacts();

                console.log(response);
            } catch (e) {
                console.error(e);
            }
        }
    }

    async function loadContacts() {
        try {
            const response = await fetch(GET_URL);
            const data = await response.json();

            phoneBookUL.innerHTML = '';
            console.log(data);

            for (const currentKey in data) {
                let contactLI = document.createElement('li');
                contactLI.setAttribute('key', currentKey);
                contactLI.innerText = `${data[currentKey].person}: ${data[currentKey].phone}`;

                let deleteBtn = document.createElement('button');
                deleteBtn.innerText = 'Delete'
                deleteBtn.addEventListener('click', deleteContact);

                contactLI.appendChild(deleteBtn);
                phoneBookUL.appendChild(contactLI);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function deleteContact() {

        let key = this.parentNode.getAttribute('key');
        let url = DELETE_URL.replace('<key>', key)
        const options = {
            method: "DELETE"
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();

            loadContacts();

            console.log(response);
        } catch (e) {
            console.error(e);
        }
    }

}

attachEvents();