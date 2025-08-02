/**
 * Minimalist Checklist Application
 * Data Structure: [{ "listName": "string", "tasks": [{ "id": "string", "text": "string", "completed": boolean }] }]
 */

class ChecklistApp {
    constructor() {
        this.lists = [];
        this.activeListIndex = null;
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.loadFromLocalStorage();
        this.bindEvents();
        this.render();
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // List management events
        document.getElementById('addListBtn').addEventListener('click', () => this.addList());
        document.getElementById('newListInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addList();
        });
        
        document.getElementById('listSelector').addEventListener('change', (e) => {
            this.setActiveList(parseInt(e.target.value));
        });
        
        document.getElementById('deleteListBtn').addEventListener('click', () => this.deleteList());

        // Task management events
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('newTaskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    /**
     * Load data from localStorage
     */
    loadFromLocalStorage() {
        try {
            const storedData = localStorage.getItem('checklistApp');
            if (storedData) {
                this.lists = JSON.parse(storedData);
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            this.lists = [];
        }
    }

    /**
     * Save data to localStorage
     */
    saveToLocalStorage() {
        try {
            localStorage.setItem('checklistApp', JSON.stringify(this.lists));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Add a new list
     */
    addList() {
        const input = document.getElementById('newListInput');
        const listName = input.value.trim();
        
        if (!listName) return;
        
        // Check if list name already exists
        if (this.lists.some(list => list.listName === listName)) {
            alert('A list with this name already exists!');
            return;
        }

        const newList = {
            listName: listName,
            tasks: []
        };

        this.lists.push(newList);
        this.saveToLocalStorage();
        
        input.value = '';
        this.renderListSelector();
        this.setActiveList(this.lists.length - 1);
    }

    /**
     * Delete the current active list
     */
    deleteList() {
        if (this.activeListIndex === null) return;
        
        const listName = this.lists[this.activeListIndex].listName;
        if (confirm(`Are you sure you want to delete the list "${listName}"? This action cannot be undone.`)) {
            this.lists.splice(this.activeListIndex, 1);
            this.activeListIndex = null;
            this.saveToLocalStorage();
            this.render();
        }
    }

    /**
     * Set the active list by index
     */
    setActiveList(index) {
        if (index < 0 || index >= this.lists.length) {
            this.activeListIndex = null;
        } else {
            this.activeListIndex = index;
        }
        this.renderActiveList();
        this.updateDeleteButton();
    }

    /**
     * Add a new task to the active list
     */
    addTask() {
        if (this.activeListIndex === null) return;
        
        const input = document.getElementById('newTaskInput');
        const taskText = input.value.trim();
        
        if (!taskText) return;

        const newTask = {
            id: this.generateId(),
            text: taskText,
            completed: false
        };

        this.lists[this.activeListIndex].tasks.push(newTask);
        this.saveToLocalStorage();
        
        input.value = '';
        this.renderTasks();
        this.updateProgress();
    }

    /**
     * Delete a task by ID
     */
    deleteTask(taskId) {
        if (this.activeListIndex === null) return;
        
        const tasks = this.lists[this.activeListIndex].tasks;
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            this.saveToLocalStorage();
            this.renderTasks();
            this.updateProgress();
        }
    }

    /**
     * Toggle task completion status
     */
    toggleTask(taskId) {
        if (this.activeListIndex === null) return;
        
        const task = this.lists[this.activeListIndex].tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveToLocalStorage();
            this.renderTasks();
            this.updateProgress();
        }
    }

    /**
     * Edit a task's text
     */
    editTask(taskId, newText) {
        if (this.activeListIndex === null) return;
        
        const task = this.lists[this.activeListIndex].tasks.find(task => task.id === taskId);
        if (task && newText.trim()) {
            task.text = newText.trim();
            this.saveToLocalStorage();
            this.renderTasks();
        }
    }

    /**
     * Generate a unique ID for tasks
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    /**
     * Render the entire application
     */
    render() {
        this.renderListSelector();
        this.renderActiveList();
        this.updateDeleteButton();
        this.updateNoListsState();
    }

    /**
     * Render the list selector dropdown
     */
    renderListSelector() {
        const selector = document.getElementById('listSelector');
        selector.innerHTML = '<option value="">Select a list...</option>';
        
        this.lists.forEach((list, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = list.listName;
            if (index === this.activeListIndex) {
                option.selected = true;
            }
            selector.appendChild(option);
        });
    }

    /**
     * Render the active list section
     */
    renderActiveList() {
        const activeSection = document.getElementById('activeListSection');
        const listNameElement = document.getElementById('activeListName');
        
        if (this.activeListIndex !== null && this.lists[this.activeListIndex]) {
            listNameElement.textContent = this.lists[this.activeListIndex].listName;
            activeSection.classList.remove('hidden');
            this.renderTasks();
            this.updateProgress();
        } else {
            activeSection.classList.add('hidden');
        }
    }

    /**
     * Render all tasks for the active list
     */
    renderTasks() {
        if (this.activeListIndex === null) return;
        
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const tasks = this.lists[this.activeListIndex].tasks;
        
        tasksList.innerHTML = '';
        
        if (tasks.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        
        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            tasksList.appendChild(taskElement);
        });
    }

    /**
     * Create a task element
     */
    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:border-gray-300 ${task.completed ? 'task-completed' : ''}`;
        
        taskDiv.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text flex-1 cursor-pointer ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
            <button class="delete-btn text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors duration-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        `;

        // Bind events for this task
        const checkbox = taskDiv.querySelector('.task-checkbox');
        const taskText = taskDiv.querySelector('.task-text');
        const deleteBtn = taskDiv.querySelector('.delete-btn');
        
        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
        
        // Edit functionality
        taskText.addEventListener('click', () => this.startEdit(taskText, task.id));
        
        return taskDiv;
    }

    /**
     * Start editing a task
     */
    startEdit(textElement, taskId) {
        const currentText = textElement.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'task-edit-input flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500';
        
        textElement.parentNode.replaceChild(input, textElement);
        input.focus();
        input.select();
        
        const finishEdit = () => {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                this.editTask(taskId, newText);
            } else {
                this.renderTasks();
            }
        };
        
        input.addEventListener('blur', finishEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                finishEdit();
            }
        });
    }

    /**
     * Update the progress bar and text
     */
    updateProgress() {
        if (this.activeListIndex === null) return;
        
        const tasks = this.lists[this.activeListIndex].tasks;
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${completedTasks} / ${totalTasks} tasks complete`;
    }

    /**
     * Update the delete button state
     */
    updateDeleteButton() {
        const deleteBtn = document.getElementById('deleteListBtn');
        deleteBtn.disabled = this.activeListIndex === null;
    }

    /**
     * Update the no lists state visibility
     */
    updateNoListsState() {
        const noListsState = document.getElementById('noListsState');
        if (this.lists.length === 0) {
            noListsState.classList.remove('hidden');
        } else {
            noListsState.classList.add('hidden');
        }
    }

    /**
     * Escape HTML to prevent XSS attacks
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChecklistApp();
});