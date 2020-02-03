const BASE_URL = 'http://localhost:3000'

window.addEventListener('load', () => {
    getTodos()
    attachClickToTodoLinks()
})

function getTodos(){
    clearForm()
    let main = document.querySelector('#main')
    main.innerHTML = ""
    fetch(BASE_URL+'/todos')
    .then(resp => resp.json())
    .then(todos => {
        main.innerHTML+= todos.map(todo =>  `
        <li><a href="#" data-id="${todo.id}">${todo.description}</a> 
        - ${todo.completed ? "Completed" : "Not Completed"}
        <button data-id=${todo.id} onclick="removeTodo(${todo.id})"; return false;>Delete</button>
        <button data-id=${todo.id} onclick="editTodo(${todo.id})"; return false;>Edit</button>
        </li>
        `).join('')

        attachClickToTodoLinks()
    })
}

function clearForm(){
    let todoFormDiv = document.getElementById("todo-form")
    todoFormDiv.innerHTML = ''
}

function attachClickToTodoLinks(){
    let todos = document.querySelectorAll("li a")
    todos.forEach(todo =>{
        todo.addEventListener('click', displayTodo)
    })
}

function displayCreateForm(){
    let todoFormDiv = document.getElementById("todo-form") 
    let html = `
        <form onsubmit="createTodo();return false;">
        <label>Description:</label>
        <input type ="text" id="description"></br>
        <label>Compete:</label>
        <input type ="checkbox" id="completed"></br>
        <input type ="submit" value="Create Todo">
    `
    todoFormDiv.innerHTML = html
}

function createTodo(){
    const todo = {
        description: document.getElementById('description').value,
        completed: document.getElementById('completed').checked
    }
    fetch(BASE_URL+'/todos',{
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(todo => {
        document.querySelector('#main').innerHTML += `
        <li><a href="#" data-id="${todo.id}">${todo.description}</a>
         - ${todo.completed ? "Completed" : "Not Completed"}
         <button data-id=${todo.id} onclick="removeTodo(${todo.id})"; return false;>Delete</button>
         <button data-id=${todo.id} onclick="editTodo(${todo.id})"; return false;>Edit</button>
         </li>
        `
        attachClickToTodoLinks()
        clearForm()
    })
}

function displayTodo(e){
    e.preventDefault()
    clearForm()
    let id = this.dataset.id
    let main = document.querySelector('#main')
    main.innerHTML = ""
    fetch(BASE_URL + `/todos/${id}`)
    .then(resp => resp.json())
    .then(todo => {
        main.innerHTML += `
        <h3>${todo.description}</h3> <hr>
        <p>${todo.completed ? "Completed" : "Not Completed"}</p>
        `
    })
}

function removeTodo(id){
    clearForm()
    fetch(BASE_URL + `/todos/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(event.target.parentElement.remove())
}

function editTodo(id){
    clearForm()
    fetch(BASE_URL + `/todos/${id}`)
    .then(resp => resp.json())
    .then(todo => {
        let todoFormDiv = document.getElementById("todo-form") 
        let html = `
            <form onsubmit="updateTodo(${id});return false;">
            <label>Description:</label>
            <input type ="text" id="description" value="${todo.description}"></br>
            <label>Compete:</label>
            <input type ="checkbox" id="completed" ${todo.completed ? "checked" : ""}></br>
            <input type ="submit" value="Edit Todo">
        `
        todoFormDiv.innerHTML = html
    })
}

function updateTodo(id){
    const todo = {
        description: document.getElementById("description").value,
        completed: document.getElementById('completed').checked
    }
    fetch(BASE_URL + `/todos/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(todo)
    })
    .then(resp => resp.json())
    .then((todo)=> {
            document.querySelectorAll(`li a[data-id="${id}"]`)[0].parentElement.innerHTML =  `
                <a href="#" data-id="${todo.id}">${todo.description}</a>
                - ${todo.completed ? "Completed" : "Not Completed"}
                <button data-id=${todo.id} onclick="removeTodo(${todo.id})"; return false;>Delete</button>
                <button data-id=${todo.id} onclick="editTodo(${todo.id})"; return false;>Edit</button>
                `
            attachClickToTodoLinks()
            clearForm()
        }
    
    )
}



