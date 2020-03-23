import { fireBaseRequestFactory } from "./firebase-reqs.js";
import { extractFormData } from './form-helpers.js';
const apiKey = 'https://students-db-615ed.firebaseio.com/';

const elements = {
    firstName: document.querySelector('body > form > input[type=title]:nth-child(3)'),
    lastName: document.querySelector('body > form > input[type=title]:nth-child(5)'),
    facultyNumber: document.querySelector('body > form > input[type=title]:nth-child(7)'),
    grade: document.querySelector('body > form > input[type=title]:nth-child(9)')
}

const studentEntity = fireBaseRequestFactory(apiKey, 'students')

function addTableRow(tbody, bookValue, bookId) {

    let tempRow = document.createElement('tr');
    tempRow.setAttribute('data-book-id', bookId);

    tempRow.innerHTML = `
    <td>${bookId}</td>
    <td>${bookValue.firstName}</td>
    <td>${bookValue.lastName}</td>
    <td>${bookValue.facultyNumber}</td>
    <td>${bookValue.grade}</td>
    `;
    tbody.appendChild(tempRow);
}

(() => {

    let formRef = document.querySelector('form');
    let bodyRef = document.querySelector('tbody');

    const formConfig = ['firstName', 'lastName', 'facultyNumber', 'grade'];

    studentEntity.getAll()
    .then(students => {
        Object.entries(students)
        .sort((a,b) => Number(b.id) < Number(a.id) )
        .map(([id, studentData]) => {
            addTableRow(bodyRef, studentData, id);
        });
    });


    formRef.addEventListener('submit', e => {
        e.preventDefault();

        let hasEmpty = false;
    
        for (const key in elements) {
            if (elements[key].value.length === 0) {
                hasEmpty = true;
                document.querySelector(`[name=${key}]`).style.border = '1px solid red';
            } else {
                document.querySelector(`[name=${key}]`).style.border = '1px solid #ccc';
            }
        }
    
        if (hasEmpty) {
            return;
        }


        let formResult = extractFormData(e.target, formConfig);

        studentEntity.getAll()
            .then(students => {
                let nextStudentId = !students ? 0 : Object.keys(students).length;
                studentEntity.updateEntity(formResult, nextStudentId)
                    .then(() => studentEntity.getAll())
                    .then(students => {
                        bodyRef.innerHTML='';
                        Object.entries(students).map(([id, studentData]) => {
                            addTableRow(bodyRef, studentData, id);
                        });
                    });

            });

        elements.firstName.value = '';
        elements.lastName.value = '';
        elements.facultyNumber.value = '';
        elements.grade.value = '';
    });

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
})();