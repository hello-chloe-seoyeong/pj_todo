const modeChange = document.querySelector(".btn-mode");
const container = document.querySelector(".container");
const todoListsCount = document.querySelector(".todo__count__num");
const todoForm = document.querySelector(".todo__form");
const todoLists = document.querySelector(".todo__list ul");
const todoInput = document.querySelector("#todo__input");
const todoSubmit = document.querySelector(".btn-add-todo");

const TODO_LOCALSTORAGE_KEY = "todos";

let todos = [];

function handleMode(event) {
  container.classList.toggle("dark");
}

function getLocalTodo() {
  const localTodo = localStorage.getItem(TODO_LOCALSTORAGE_KEY);
  const todoObj = JSON.parse(localTodo);

  return todoObj;
}

function countingTodoLists() {
  // const todoObj = getLocalTodo();
  let todoCount = 0;
  todos.forEach(todo => {
    if (todo.completed === false) {
      todoCount = todoCount + 1;
    }
  })

  todoListsCount.innerHTML = todoCount;
}

function saveTodos() {
  localStorage.setItem(TODO_LOCALSTORAGE_KEY, JSON.stringify(todos));
  countingTodoLists();
}

function deleteTodo(event) {
  const current = event.currentTarget;
  const targetLi = current.parentElement;
  targetLi.remove();
  todos = todos.filter((todo) => todo.id !== parseInt(targetLi.id));
  saveTodos(todos);
}

function handleTodoCheck(event) {
  const todoID = event.target.id - 1;
  todos.forEach(todo => {
    if(todo.id === todoID) {
      if(todo.completed === true) {
        todo.completed = false;
      } else {
        todo.completed = true;
      }
    }
  })
  saveTodos();
}

function paintTodo(todoObj) {
  const li = document.createElement("li");
  li.id = todoObj.id;
  const todoId = todoObj.id + 1;
  const todoText = todoObj.text;
  // li.innerHTML = `
  //   <input type="checkbox" name="todo" id=${todoId} />
  //   <label for=${todoId}>${todoText}</label>
  // `;

  const button = document.createElement("button");
  const todoCheck = document.createElement("input");
  const todoLabel = document.createElement("label");
  todoCheck.setAttribute("type", "checkbox");
  todoCheck.name = "todo";
  todoCheck.id = todoId;
  todoLabel.setAttribute("for", todoId);
  todoLabel.innerText = todoText;

  button.classList.add("btn-delete-todo");
  button.innerHTML = `
      <i></i>
      <span class="a11y-hidden">delete</span>
  `;

  button.addEventListener("click", deleteTodo);
  todoCheck.addEventListener("change", handleTodoCheck);

  li.append(todoCheck);
  li.append(todoLabel);
  li.append(button);

  todoLists.append(li);
}


function handleSubmit(event) {
  event.preventDefault();
  const newTodo = todoInput.value;
  todoInput.value = "";
  const newTodoObj = {
    text: newTodo,
    id: Date.now(),
    completed: false
  }
  todos.push(newTodoObj);
  paintTodo(newTodoObj);
  saveTodos();
}

modeChange.addEventListener("click", handleMode);
todoForm.addEventListener("submit", handleSubmit);

const savedTodoLists = getLocalTodo();

if(savedTodoLists) {
  // const parsedTodoList = JSON.parse(savedTodoLists);
  todos = savedTodoLists;

  todos.forEach(paintTodo);
  countingTodoLists();
}

