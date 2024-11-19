const modeChange = document.querySelector(".btn-mode");
const container = document.querySelector(".container");
const todoListsCount = document.querySelector(".todo__count__num");
const todoForm = document.querySelector(".todo__form");
const todoLists = document.querySelector(".todo__list ul");
const todoInput = document.querySelector("#todo__input");
const todoSubmit = document.querySelector(".btn-add-todo");

let todos = [];

function countingTodoLists() {
  // todoListsCount.innerHTML = todoLists.length;
  todoListsCount.innerHTML = todoLists.children.length;
}

function handleMode(event) {
  container.classList.toggle("dark");
}

function paintTodo(todoObj) {
  const li = document.createElement("li");
  const todoId = todoObj.id;
  const todoText = todoObj.text;
  li.innerHTML = `
    <input type="checkbox" name="todo" id=${todoId} />
    <label for=${todoId}>${todoText}</label>
    <button class="btn-delete">
      <i></i>
      <span class="a11y-hidden">delete</span>
    </button>
  `;
  todoLists.append(li);
  countingTodoLists();
}

function handleSubmit(event) {
  event.preventDefault();
  const newTodo = todoInput.value;
  todoInput.value = "";
  const newTodoObj = {
    text: newTodo,
    id: Date.now()
  }
  todos.push(newTodoObj);
  paintTodo(newTodoObj);
}

countingTodoLists();

modeChange.addEventListener("click", handleMode);
todoForm.addEventListener("submit", handleSubmit);
