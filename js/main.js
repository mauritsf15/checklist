// Main.js
// Mau's checklists

// Buttons

const addBtn = document.querySelector('#add-button');

// Divs

const listDiv = document.querySelector('#list');

// Other variables

// Format: id, name, checked
let listArray = [
    [1, 'Passport', true]
];

// Functions

function addItem() {
    // Add div to HTML
    listDiv.innerHTML += `
    <div class="checklist-item mt-3 fs-5 d-flex align-content-center gap-2">
        <input class="form-check-input hidden" type="checkbox" id="item-1">
        <label class="form-check-label text-light hidden" for="item-1">Passport</label>
        <i id="edit-1" class="edit-btn bi bi-pencil-fill text-accent hover hidden"></i>
        <input class="form-control" type="text" id="text-1">
        <i id="save-1" class="save-btn bi bi-floppy-fill text-accent hover"></i>
        <i id="trash-1" class="trash-btn bi bi-trash-fill text-accent hover"></i>
    </div>
    `;
    // Add event listeners to buttons
}

function refreshScreen() {
    for (let i = 0; i < listArray.length; i++) {
        listDiv.innerHTML += `
        <div id="item-${listArray[i][0]}" class="checklist-item mt-3 fs-5 d-flex align-content-center gap-2">
            <input class="form-check-input" type="checkbox" value="${listArray[i][2]}" name="check-${listArray[i][0]}">
            <label class="form-check-label text-light" for="check-${listArray[i][0]}">${listArray[i][1]}</label>
            <i class="edit-btn bi bi-pencil-fill text-accent hover"></i>
            <input class="form-control hidden" value="${listArray[i][1]}" type="text" id="text-1">
            <i class="save-btn bi bi-floppy-fill text-accent hover hidden"></i>
            <i class="trash-btn bi bi-trash-fill text-accent hover hidden"></i>
        </div>
        `
        const editBtn = document.querySelector(`#item-${listArray[i][0]} .edit-btn`);
        const saveBtn = document.querySelector(`#item-${listArray[i][0]} .save-btn`);
        const trashBtn = document.querySelector(`#item-${listArray[i][0]} .trash-btn`);
        editBtn.addEventListener('click', edit)
        saveBtn.addEventListener('click', save)
        trashBtn.addEventListener('click', trash)
    }
}

function edit(e) {
    // const id = e.srcElement.parentNode.id;
    toggleView(e);
}

function save(e) {
    // const id = e.srcElement.parentNode.id;
    toggleView(e);
}

function trash(e) {
    // const id = e.srcElement.parentNode.id;
    toggleView(e);
}

function toggleView(e) {
    const item = e.srcElement.parentNode;
    item.querySelector('.form-check-input').classList.toggle('hidden');
    item.querySelector('.form-check-label').classList.toggle('hidden');
    item.querySelector('.edit-btn').classList.toggle('hidden');
    item.querySelector('.form-control').classList.toggle('hidden');
    item.querySelector('.save-btn').classList.toggle('hidden');
    item.querySelector('.trash-btn').classList.toggle('hidden');
}

// Event listeners

if (addBtn) {
    addBtn.addEventListener('click', addItem);
}

// Auto functions

refreshScreen();