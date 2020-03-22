function attachEvents() {

    const sendBtn = document.querySelector('#submit');
    const textbox = document.querySelector('#messages');

    const nameInput = document.querySelector('#author');
    const messageInput = document.querySelector('#content');

    const refreshBtn = document.querySelector('#refresh');

    const GET_URL = "https://rest-messanger.firebaseio.com/messanger.json";

    sendBtn.addEventListener('click', send);
    refreshBtn.addEventListener('click', load);

    async function send() {
        if (nameInput.value.length > 0 && messageInput.value.length > 0) {
            let message = {
                author: nameInput.value,
                content: messageInput.value
            }

            const options = {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
                method: "POST"
            };

            try {
                const response = await fetch(GET_URL, options);
                const data = await response.json();


                nameInput.value = "";
                messageInput.value = "";

                load();

                console.log(response);
            } catch (e) {
                console.error(e);
            }
        }
    }

    async function load() {
        try {
            const response = await fetch(GET_URL);
            const data = await response.json();

            textbox.value = "";
            console.log(data);

            for (const key in data) {
                textbox.value += data[key].author + ': ' + data[key].content + '\n';
            }

            textbox.value = textbox.value.trim();
            textbox.scrollTop = textbox.scrollHeight;
        } catch (e) {
            console.error(e);
        }
    }
}

attachEvents();