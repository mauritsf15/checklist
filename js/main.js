// Main.js
// Mau's checklists

// Variables

const addBtns = document.querySelectorAll('#add-button');
const listDiv = document.querySelector('#list');

// Local storage

// Format: name, checked, editing
let listArray = [];

function setLocalStorage() {
    localStorage.clear();
    localStorage.setItem('length', listArray.length);
    for (let i = 0; i < listArray.length; i++) {
        localStorage.setItem(i, JSON.stringify(listArray[i]));
    }
}

function getLocalStorage() {
    const length = localStorage.getItem('length');
    for (let i = 0; i < length; i++) {
        listArray.push(JSON.parse(localStorage.getItem(i)));
    }
    refreshScreen();
}

// Functions

function addItem() {
    listArray.push(['', '', true]);
    refreshScreen();
}

function refreshScreen() {
    listDiv.innerHTML = '';
    for (let i = 0; i < listArray.length; i++) {
        const dots = listArray[i][0].length < 20 ? '' : '...';
        if (listArray[i][2] == true) {
            listDiv.innerHTML += `
            <div id="item-${i}" class="checklist-item mt-3 fs-5 d-flex align-content-center gap-2">
                <input class="form-check-input hidden" type="checkbox" name="check-${i}" id="check-${i}" ${listArray[i][1]}>
                <label class="form-check-label hidden" for="check-${i}">${listArray[i][0].slice(0,20)}${dots}</label>
                <i class="edit-btn bi bi-pencil-fill icon hover hidden"></i>
                <input class="form-control" value="${listArray[i][0]}" type="text" id="text-1">
                <i class="save-btn bi bi-floppy-fill icon hover"></i>
                <i class="trash-btn bi bi-trash-fill icon hover"></i>
            </div>
            `
            document.querySelector(`#item-${i} .form-control`).focus();
        } else {
            listDiv.innerHTML += `
            <div id="item-${i}" class="checklist-item mt-3 fs-5 d-flex align-content-center gap-2">
                <input class="form-check-input" type="checkbox" name="check-${i}" id="check-${i}" ${listArray[i][1]}>
                <label class="form-check-label flex-grow-1" for="check-${i}">${listArray[i][0].slice(0,20)}${dots}</label>
                <i class="edit-btn bi bi-pencil-fill icon hover"></i>
                <input class="form-control hidden" value="${listArray[i][0]}" type="text" id="text-1">
                <i class="save-btn bi bi-floppy-fill icon hover hidden"></i>
                <i class="trash-btn bi bi-trash-fill icon hover hidden"></i>
            </div>
            `
        }
    }

    // Button event listeners
    const editBtns = document.querySelectorAll('.edit-btn');
    const saveBtns = document.querySelectorAll('.save-btn');
    const trashBtns = document.querySelectorAll('.trash-btn');
    editBtns.forEach((e) => e.addEventListener('click', edit));
    saveBtns.forEach((e) => e.addEventListener('click', save));
    trashBtns.forEach((e) => e.addEventListener('click', trash));
    
    // Update every input on every change
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach((e) => e.addEventListener('change', saveValue));

    // Checkboxes
    const checkBoxes = document.querySelectorAll('.form-check-input');
    checkBoxes.forEach((e) => e.addEventListener('change', check));
    
    setLocalStorage();
}

function edit(e) {
    const id = e.srcElement.parentNode.id.substr(5, 4);
    const item = listArray[id];

    listArray[id] = [item[0], item[1], true];
    refreshScreen();
}

function save(e) {
    const id = e.srcElement.parentNode.id.substr(5, 4);
    const item = listArray[id];

    const newValue = e.srcElement.parentNode.querySelector(`.form-control`);

    listArray[id] = [newValue.value, item[1], false];

    refreshScreen();
}

function saveValue(e) {
    const id = e.srcElement.parentNode.id.substr(5, 4);
    const item = listArray[id];

    const newValue = e.srcElement.parentNode.querySelector(`.form-control`);

    listArray[id] = [newValue.value, item[1], false];
}

function trash(e) {
    const id = e.srcElement.parentNode.id.substr(5, 4);

    listArray.splice(id, 1);

    refreshScreen();
}

function check(e) {
    console.log('test');
    const id = e.srcElement.parentNode.id.substr(5, 4);
    const item = listArray[id];

    if (listArray[id][1] == 'checked') {
        listArray[id] = [item[0], '', item[2]];
    } else {
        listArray[id] = [item[0], 'checked', item[2]];
    }

    refreshScreen();
}

// Event listeners

if (addBtns) {
    addBtns.forEach((e) => e.addEventListener('click', addItem));
}

// Auto functions

getLocalStorage();