const modeChange = document.querySelector(".btn-mode");
const container = document.querySelector(".container");
const todoListsCount = document.querySelector(".todo__count__num");
const todoForm = document.querySelector(".todo__form");
const todoFormMsg = document.querySelector(".todo__form-message")
const todoLists = document.querySelector(".todo__list ul");
const todoInput = document.querySelector("#todo__input");
const todoSubmit = document.querySelector(".btn-todo-add");
const btnTodoClear = document.querySelector(".btn-todo-clear");
const filterAll = document.querySelector("#radio-all");
const filterActive = document.querySelector("#radio-active");
const filterCompleted = document.querySelector("#radio-complete");

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
  saveTodos();
}

function handleTodoCheck(event) {
  const todoID = event.target.id - 1;
  todos.forEach(todo => {
    if(todo.id === todoID) {
      todo.completed ? todo.completed = false : todo.completed = true;
    }
  })
  saveTodos();
}

function paintTodo(todoObj) {
  const li = document.createElement("li");
  li.id = todoObj.id;
  li.setAttribute("draggable", "true");
  const todoId = todoObj.id + 1;
  const todoText = todoObj.text;
  // li.innerHTML = `
  //   <input type="checkbox" name="todo" id=${todoId} />
  //   <label for=${todoId}>${todoText}</label>
  // `;

  li.addEventListener("dragstart", (event) => {
    event.target.classList.add("dragging");
  });
  li.addEventListener("dragend", (event) => {
    event.target.classList.remove("dragging");
  })

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
  if(todoInput.value !== "") {
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
  } else {
    todoFormMsg.classList.add("show");
    setTimeout(() => {
      todoFormMsg.classList.remove("show");
    }, 1500)
    console.log("You need to write down something...")
  }
}

function clearTodoList() {
  // localStorage.clear();
  // todos = [];
  const todoLis = Array.from(todoLists.children);

  todoLis.forEach(todoLi => {
    if(todoLi.children[0].checked === true) {
      todoLi.remove();
    }
  })

  todos = todos.filter(todo => todo.completed !== true);

  saveTodos();
  countingTodoLists();
}

function handleFilter(event) {
  const todoLis = Array.from(todoLists.children);

  if(event.target.id === "radio-all") {
    todoLis.forEach(todoLi => {
      todoLi.classList.remove("hide");
      // if(todoLi.classList.contains("hide")) {
      // }
    })
  } else if(event.target.id === "radio-active") {
    todoLis.forEach(todoLi => {
      todoLi.classList.remove("hide");
      if(todoLi.children[0].checked === true) {
        todoLi.classList.add("hide");
      }
    })
  } else if(event.target.id === "radio-complete") {
    todoLis.forEach(todoLi => {
      todoLi.classList.remove("hide");
      if(todoLi.children[0].checked !== true) {
        todoLi.classList.add("hide");
      }
    })
  }
}

modeChange.addEventListener("click", handleMode);
todoForm.addEventListener("submit", handleSubmit);
btnTodoClear.addEventListener("click", clearTodoList);
filterAll.addEventListener("change", handleFilter);
filterActive.addEventListener("change", handleFilter);
filterCompleted.addEventListener("change", handleFilter);

const savedTodoLists = getLocalTodo();

if(savedTodoLists) {
  // const parsedTodoList = JSON.parse(savedTodoLists);
  todos = savedTodoLists;

  todos.forEach(paintTodo);
  countingTodoLists();
} else {
  countingTodoLists();
}

todoLists.addEventListener("dragover", e => {
  e.preventDefault();
  const afterElement = getDragAfterElement(todoLists, e.clientY);
  const draggable = document.querySelector(".dragging");
  const dragItemId = (element) => {
    if(element.id === Number(draggable.id)) {
      return draggable.id
    }
  }
  // const dragItemIndex = todos.at(dragItemId);
  // const currentDragItem = todos.slice(dragItemIndex, 1);

  if (afterElement === undefined) {
    todoLists.appendChild(draggable);
    // todos.push(dragItemId);
  } else {
    todoLists.insertBefore(draggable, afterElement);
    // todos.push(dragItemId);
  }
});

function getDragAfterElement(todoLists, y) {
  const draggableElements = [
    ...todoLists.querySelectorAll("li:not(.dragging)"),
  ];

  let closestElement = null;  // 가장 가까운 요소를 저장할 변수
  let closestOffset = Number.NEGATIVE_INFINITY;  // 가장 가까운 요소의 offset (초기값은 아주 작은 값)

  // 각 draggable 요소를 순회하면서 가장 가까운 요소를 찾음
  for (let i = 0; i < draggableElements.length; i++) {
    const child = draggableElements[i];
    const box = child.getBoundingClientRect();  // 현재 요소의 위치와 크기 정보

    // 드래그하려는 위치와 요소의 중앙 위치 차이를 계산
    const offset = y - box.top - box.height / 2;

    // offset이 0보다 작은 값이고, 이전에 찾은 가장 가까운 요소보다 더 가까운 위치라면
    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;  // 가장 가까운 offset 값 갱신
      closestElement = child;  // 가장 가까운 요소 갱신
    }
  }

  return closestElement;  // 가장 가까운 요소를 반환
}
