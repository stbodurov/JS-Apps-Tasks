(() => {
    const elements = {
        loadBtn: document.querySelector('#loadBooks'),

        titleInput: document.querySelector('#title'),
        authorInput: document.querySelector('#author'),
        isbnInput: document.querySelector('#isbn'),
        addBtn: document.querySelector('body > form > button'),

        table: document.querySelector('table'),
        tableBody: document.querySelector('tbody')
    }

    const GET_URL = 'https://books-db-f408a.firebaseio.com/books.json';
    const MODIFY_URL = 'https://books-db-f408a.firebaseio.com/books/{bookID}.json';

    listBooks();

    elements.loadBtn.addEventListener('click', listBooks);
    elements.addBtn.addEventListener('click', addBook);

    function listBooks(event) {
        fetch(GET_URL)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong on firebase server!');
                }
            })
            .then(data => {
                elements.tableBody.innerHTML = '';

                for (const key in data) {
                    let bookTR = createHTMLElement('tr', null, null, [{ k: 'bookID', v: key }]);

                    const titleTD = createHTMLElement('td', null, data[key].title);
                    const authorTD = createHTMLElement('td', null, data[key].author);
                    const isbnTD = createHTMLElement('td', null, data[key].isbn);
                    bookTR = appendChildrenToParent([titleTD, authorTD, isbnTD], bookTR);

                    let buttonTD = createHTMLElement('td');

                    const editBtn = createHTMLElement('button', null, 'Edit', null, { name: 'click', func: editBook });
                    const deleteBtn = createHTMLElement('button', null, 'Delete', null, { name: 'click', func: deleteBook });
                    buttonTD = appendChildrenToParent([editBtn, deleteBtn], buttonTD);
                    bookTR = appendChildrenToParent([buttonTD], bookTR)

                    elements.tableBody.appendChild(bookTR);
                }

                return data;
            }).catch(error => {
                console.error(error);
            });
    }

    function addBook(event) {
        event.preventDefault();

        let hasEmptyInputs = false;
        const inputs = [elements.titleInput, elements.authorInput, elements.isbnInput];

        inputs.forEach((element) => {
            const currentValue = element.value;
            if (currentValue.length === 0) {
                element.style.border = "1px solid red";
                hasEmptyInputs = true;
            } else {
                element.style.border = "1px solid #ccc";
            }
        });

        if (hasEmptyInputs) {
            return;
        }

        const newBook = {
            author: inputs[1].value,
            isbn: inputs[2].value,
            title: inputs[0].value
        }

        inputs.forEach((element) => {
            element.value = '';
        });

        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBook),
            method: "POST"
        };

        fetch(GET_URL, options)
            .then(res => {
                const data = res.json();

                listBooks();

                return data;
            })
            .catch(e => console.error(e));
    }

    var editForm = createHTMLElement('form');
    var key;
    function editBook(event) {
        let bookTR = event.target.parentNode.parentNode;


        key = bookTR.getAttribute('bookid')
        let [title, author, isbn] = bookTR.querySelectorAll('td');


        var editForm = createHTMLElement('form');
        editForm.innerHTML = `<h3>Editing "${title.innerHTML}"</h3>
        <label>TITLE</label>
        <input type="title" id="title" value="${title.innerHTML}">
        <label>AUTHOR</label>
        <input type="title" id="author" value="${author.innerHTML}">
        <label>ISBN</label>
        <input type="title" id="isbn" value="${isbn.innerHTML}">`

        let changeBtn = createHTMLElement('button', null, 'Change', null, { name: 'click', func: changeBook.bind(editBook) });
        let cancelBtn = createHTMLElement('button', null, 'Cancel', null, { name: 'click', func: cancelEdit });
        editForm = appendChildrenToParent([changeBtn, cancelBtn], editForm);

        document.body.insertBefore(editForm, document.querySelector('form'));
    }

    function changeBook(e) {
        e.preventDefault();

        let bookTR = e.target.parentNode;
       
        

        let [title, author, isbn] = bookTR.querySelectorAll('input');

        let updateBook = {
            author: author.value,
            isbn: isbn.value,
            title: title.value
        }

        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateBook),
            method: "PUT"
        };

        
        
        let UPDATE_URL = MODIFY_URL.replace('{bookID}', key)
        fetch(UPDATE_URL, options)
            .then(res => {
                const data = res.json();

                listBooks();

                bookTR.remove();

                return data;
            })
            .catch(e => console.error(e));
    }

    function cancelEdit(e) {
        e.preventDefault();
        this.parentNode.remove();
    }

    async function deleteBook(event) {
        let bookTR = event.target.parentNode.parentNode;


        const DELETE_URL = MODIFY_URL.replace('{bookID}', bookTR.getAttribute('bookid'));

        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        };

        await fetch(DELETE_URL, options)
            .then(res => res.json())
            .catch(e => console.log(e));

        listBooks();
    }

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

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
})();