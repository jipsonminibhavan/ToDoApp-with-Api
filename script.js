const newInput = document.querySelector("#new-todo");
const delbtn = document.querySelector("#btn-delete");
const addbtn = document.querySelector("#btn-add");
const todoList = document.querySelector("#todo-list");
const API_URL = "http://localhost:4730/todos";

addbtn.addEventListener("click", addToDo);
todoList.addEventListener("change", updateTodo);
delbtn.addEventListener("click", deleteTodos);

loadTodos();
let todos = [];

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((data) => {
      todos = data;
      renderTodos();
      console.log(todos);
    });
}

function renderTodos() {
  todoList.textContent = ""; //alles was vorher ist wird gelöscht

  // Für jedes Todo wird ein Eintrag erzeugt inkl. Checkbox
  todos.forEach((todo) => {
    const todoLi = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    todoLi.appendChild(checkbox);

    const todoText = document.createTextNode(todo.description);
    todoLi.append(todoText);

    todoLi.setAttribute("data-id", todo.id);
    todoList.appendChild(todoLi);
  });
}

function addToDo() {
  if (newInput.value.length > 0) {
    const newTodo = {
      description: newInput.value,
      done: false,
    };
    newInput.value = "";

    fetch("http://localhost:4730/todos", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((newData) => {
        todos.push(newData);
        renderTodos();
      });
  }
}

function updateTodo(e) {
  const id = e.target.parentElement.getAttribute("data-id");
  const updatedTodo = {
    description: e.target.nextSibling.textContent,
    done: e.target.checked,
  };

  fetch("http://localhost:4730/todos/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTodo),
  })
    .then((response) => response.json())
    .then(() => {
      loadTodos();
    });
}
function deleteTodos() {
  todos.forEach((todo) => {
    if (todo.done === true) {
      fetch("http://localhost:4730/todos/" + todo.id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          loadTodos();
        });
    }
  });
}
