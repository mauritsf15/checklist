// Main.js
// Mau's checklists

// Buttons

const addBtn = document.querySelector('#add-button');

// Divs

const listDiv = document.querySelector('#list');

// Local storage

// Format: name, checked, editing
let listArray = [];

function setLocalStorage() {
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
        if (listArray[i][2] == true) {
            listDiv.innerHTML += `
            <div id="item-${i}" class="checklist-item mt-3 fs-5 d-flex align-content-center gap-2">
                <input class="form-check-input hidden" type="checkbox" name="check-${i}" ${listArray[i][1]}>
                <label class="form-check-label text-light hidden" for="check-${i}">${listArray[i][0]}</label>
                <i class="edit-btn bi bi-pencil-fill text-accent hover hidden"></i>
                <input class="form-control" value="${listArray[i][0]}" type="text" id="text-1">
                <i class="save-btn bi bi-floppy-fill text-accent hover"></i>
                <i class="trash-btn bi bi-trash-fill text-accent hover"></i>
            </div>
            `
        } else {
            listDiv.innerHTML += `
            <div id="item-${i}" class="checklist-item mt-3 fs-5 d-flex align-content-center gap-2">
                <input class="form-check-input" type="checkbox" name="check-${i}" ${listArray[i][1]}>
                <label class="form-check-label text-light" for="check-${i}">${listArray[i][0]}</label>
                <i class="edit-btn bi bi-pencil-fill text-accent hover"></i>
                <input class="form-control hidden" value="${listArray[i][0]}" type="text" id="text-1">
                <i class="save-btn bi bi-floppy-fill text-accent hover hidden"></i>
                <i class="trash-btn bi bi-trash-fill text-accent hover hidden"></i>
            </div>
            `
        }
    
        const editBtn = document.querySelector(`#item-${i} .edit-btn`);
        const saveBtn = document.querySelector(`#item-${i} .save-btn`);
        const trashBtn = document.querySelector(`#item-${i} .trash-btn`);
        const checkBox = document.querySelector(`#item-${i} .form-check-input`)
        editBtn.addEventListener('click', edit)
        saveBtn.addEventListener('click', save)
        trashBtn.addEventListener('click', trash)
        checkBox.addEventListener('click', check)
    }
    setLocalStorage();
}

function edit(e) {
    const id = e.srcElement.parentNode.id.slice(-1);
    const item = listArray[id];

    listArray[id] = [item[0], item[1], true];
    refreshScreen();
}

function save(e) {
    const id = e.srcElement.parentNode.id.slice(-1);
    const item = listArray[id];

    const newValue = e.srcElement.parentNode.querySelector(`.form-control`);

    listArray[id] = [newValue.value, item[1], false];

    refreshScreen();
}

function trash(e) {
    const id = e.srcElement.parentNode.id.slice(-1);

    listArray.splice(id, 1);

    refreshScreen();
}

function check(e) {
    const id = e.srcElement.parentNode.id.slice(-1);
    const item = listArray[id];

    if (listArray[id][1] == 'checked') {
        listArray[id] = [item[0], '', item[2]];
    } else {
        listArray[id] = [item[0], 'checked', item[2]];
    }

    refreshScreen();
}

// Event listeners

if (addBtn) {
    addBtn.addEventListener('click', addItem);
}

// Auto functions

getLocalStorage();