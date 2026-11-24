const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyMessage = document.querySelector("#empty-message");
const filterButtons = document.querySelectorAll(".filter-btn");


const STORAGE_KEY = "interactive-task-manager-tasks";

function loadTasks() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData === null) {
            return [];
        }

        const parsedTasks = JSON.parse(savedData);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks.filter(function (task) {
            return (
                task !== null &&
                typeof task === "object" &&
                Number.isFinite(task.id) &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
            );
        });
    } catch (error) {
        console.error("Could not load saved tasks:", error);
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );
    } catch (error) {
        console.error("Could not save tasks:", error);
    }
}

let tasks = loadTasks();
let currentFilter = "all";



function renderTasks() {
    taskList.replaceChildren();

    
const visibleTasks = tasks.filter(function (task) {
    if (currentFilter === "active") {
        return !task.completed;
    }

    if (currentFilter === "completed") {
        return task.completed;
    }

    return true;
});

visibleTasks.forEach(function (task) {

        const listItem = document.createElement("li");
        listItem.classList.add("task-item");

        if (task.completed) {
            listItem.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Complete ${task.text}`);

        checkbox.addEventListener("change", function () {
            
            task.completed = checkbox.checked;

            saveTasks();
            renderTasks();

        });

        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;

        
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");

    editButton.addEventListener("click", function () {
        const updatedText = prompt("Edit your task:", task.text);

        if (updatedText === null) {
            return;
        }

        const trimmedText = updatedText.trim();

        if (trimmedText === "") {
            alert("Task cannot be empty.");
            return;
        }

        task.text = trimmedText;
        saveTasks();
        renderTasks();
    });


    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

    deleteButton.addEventListener("click", function () {
        tasks = tasks.filter(function (item) {
            return item.id !== task.id;
        });

        saveTasks();
        renderTasks();
    });

    
    listItem.appendChild(checkbox);
    listItem.appendChild(taskText);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);


    taskList.appendChild(listItem);
});

    const remainingTasks = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    taskCount.textContent =
        `${remainingTasks} ${remainingTasks === 1 ? "task" : "tasks"} remaining`;

    
    if (visibleTasks.length === 0) {
        emptyMessage.textContent =
            tasks.length === 0
            ? "No tasks yet. Add your first task!"
            : "No tasks match this filter.";
    } else {
        emptyMessage.textContent = "";
    }

    emptyMessage.hidden = visibleTasks.length > 0;

}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    
    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskForm.reset();
    taskInput.focus();
});


filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;
        console.log("Current filter:", currentFilter);

        filterButtons.forEach(function (filterButton) {
            filterButton.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

renderTasks();


