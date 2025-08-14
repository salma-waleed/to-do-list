
let inputField = document.getElementById("input");
let addButton = document.getElementById("add");
let clearButton = document.getElementById("clear");
let box = document.getElementById("box");
let clearCompleted = document.getElementById("clearCompleted");
let completed_tasks = document.getElementById("completed-tasks");
let completed_header = document.getElementById("completed-header");


mood = 'add';
let index;



let tasks = [];
if (localStorage.getItem('task')){
    tasks = JSON.parse(localStorage.getItem('task'));
}

// adding function

inputField.addEventListener("keyup" , function(){
    addButton.style.display = 'block';
})

function addFunction(){
    
    if (inputField.value.trim() !== ''){
        if(mood == 'add'){
            tasks.push(inputField.value.trim());
        }else{
            tasks[index] = inputField.value.trim();
            mood = 'add';
            addButton.innerHTML = 'ADD';
        }
    }
    inputField.value = '';
    inputField.focus();
    addButton.style.display = 'none';
    localStorage.task = JSON.stringify(tasks);
    displayData();
};


// display data


function displayData(){
    box.innerHTML = '';
    if(!localStorage.getItem('task') || tasks.length === 0){
        let empty = document.createElement("p");
        empty.style.cssText = "text-align: center; font-size:20px;color:#140116;font-weight:bold";
        empty.innerHTML = `No Tasks Added Yet....`;
        box.appendChild(empty);
    }else{
        for(let i = 0 ; i<tasks.length ; i++){
        box.innerHTML += `
        <div class="cell" id="cell-${i}" draggable = 'true'   ondragstart = "dragStart(event,${i})"  ondragover = "dragOver(event)" ondrop = "drop(event , ${i})"  ondragenter="dragEnter(event)" ondragleave="dragLeave(event)">
            <p id="taskText"> <span class="number">${i+1}</span> ${tasks[i]}</p>
            <div class="icons" id="icons">
                <span onclick="editTask(${i})"><i class="fa-solid fa-pencil"></i></span>
                <span onclick="completeTask(${i})"><i class="fa-solid fa-check"></i></span>
                <span onclick="deleteTask(${i})"><i class="fa-solid fa-trash-can"></i></span>
            </div>
        </div>`
    }
    }
};
displayData();




// drag & drop

function dragEnter(event) {
    event.currentTarget.classList.add('drag-over');
}

function dragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}



let dragIndex = null;

function dragStart(event , index){
    dragIndex = index;
    event.dataTransfer.setData("text/plain" , index);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event , dropIndex){
    event.preventDefault();
    if (dropIndex === null || dragIndex === dropIndex) return;

    const [ draggedTask ] = tasks.splice( dragIndex , 1)
    tasks.splice(dropIndex , 0 , draggedTask);

    localStorage.setItem("task" , JSON.stringify(tasks));

    displayData();
};


// clear function
function clearData(){
    tasks = [];
    localStorage.removeItem('task');
    displayData();
}

// delete function
function deleteTask(i){
    tasks.splice(i,1);
    localStorage.setItem('task',JSON.stringify(tasks));
    displayData();
}

// edit function
function editTask(i){
    scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
    inputField.value = tasks[i];
    addButton.style.display = 'block';
    addButton.innerHTML = 'UPDATE';
    mood = 'update';
    index = i;
}

// completed task function
let completedTasks = [];
if(localStorage.getItem('completed') != null){
    completedTasks = JSON.parse(localStorage.getItem("completed"));
};


function completeTask(i){
    let removerItem = tasks[i];

    completedTasks.push(removerItem);
    localStorage.setItem("completed" , JSON.stringify(completedTasks));

    tasks.splice(i , 1);
    localStorage.setItem("task" , JSON.stringify(tasks))

    displayData();
    displayCompletedTasks();
};


function displayCompletedTasks(){
    
    if(completedTasks.length === 0){
        completed_tasks.style.display = 'none';
        completed_header.style.display = 'none';
        clearCompleted.style.display = 'none';
    }else{
        completed_tasks.style.display = 'block';
        completed_header.style.display = 'block';
        clearCompleted.style.display = 'block';
    }

    completed_tasks.innerHTML = '';
        for(let i = 0 ; i< completedTasks.length ; i++){
            completed_tasks.innerHTML += `
                <div class="done-cell">
                <span><i class="fa-solid fa-x  removeCompletedTask" onclick="removeCompletedTask(${i})"></i></span>
                <p>${completedTasks[i]}</p>
            </div>
            `;
        }
};

displayCompletedTasks();



// restore completed tasks
function removeCompletedTask(i){
    let restoredItem = completedTasks[i];

    tasks.push(restoredItem);
    localStorage.setItem("task" , JSON.stringify(tasks));

    completedTasks.splice(i , 1);
    localStorage.setItem("completed" , JSON.stringify(completedTasks));

    displayData();
    displayCompletedTasks();
};


// clear completed tasks
function clearCompletedTasks(){
    completedTasks = [];
    localStorage.removeItem('completed');
    displayCompletedTasks();
};



// animation