// ! HTML Elements
var root = document.querySelector(":root")
var newTaskBtn = document.getElementById("newTask");
var modalEl = document.getElementById("modal");
var statusInput = document.getElementById("status");
var categoryInput = document.getElementById("category");
var titleInput = document.getElementById("title");
var descriptionInput = document.getElementById("description");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var searchInput = document.getElementById("searchInput");
var sections = document.querySelectorAll("section");
var gridBtn = document.getElementById("gridBtn");
var barsBtn = document.getElementById("barsBtn");
var tasks = document.querySelectorAll(".tasks");
var mode = document.getElementById("mode");
var remainingCounter = document.getElementById("remainingCounter");
var continer = document.getElementById("continer")

var containers = {
  nextUp: document.getElementById("nextUp"),
  inProgress: document.getElementById("inProgress"),
  done: document.getElementById("done"),
};

var countersEl = {
  nextUp: document.getElementById("nextUp").querySelector("span"),
  inProgress: document.getElementById("inProgress").querySelector("span"),
  done: document.getElementById("done").querySelector("span"),
};

// ! App variables
var tasksArr = getTasksfromLocal();
for (var i = 0; i < tasksArr.length; i++) {
  displayTask(i);
}

var counters = {
  nextUp: 0,
  inProgress: 0,
  done: 0,
};

var updatedIndex;
const titleRegex = /^[A-Z][a-z]{3,}$/;
const descRegx = /\w{5,100}/;

// ! Functions
function showModal() {
  modalEl.classList.replace("d-none", "d-flex");
}

function hideModal() {
  resetModal();
  modalEl.classList.replace("d-flex", "d-none");
}

function resetModal() {
  clearForm();
  addBtn.classList.replace("d-none", "d-block");
  updateBtn.classList.replace("d-block", "d-none");
}

function setTasksToLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function getTasksfromLocal() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function addTask() {
  var task = {
    status: statusInput.value,
    category: categoryInput.value,
    title: titleInput.value,
    description: descriptionInput.value,
    bgColor: "#0d1117",
  };

  tasksArr.push(task);
  setTasksToLocal();
  displayTask(tasksArr.length - 1);
  clearForm();
  hideModal();
}

function displayTask(index) {
  var taskHTML = `
  <div class="task" style="background-color: ${tasksArr[index].bgColor}">
    <h3 class="text-capitalize">${tasksArr[index]?.title}</h3>
    <p class="description text-capitalize">${tasksArr[index]?.description}</p>
    <h4 class="category ${tasksArr[index]?.category} text-capitalize">${tasksArr[index]?.category}</h4>
    <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
      <li><i class="fa-solid fa-pen-to-square" onclick="getTaskInfo(${index})"></i></li>
      <li><i class="fa-solid fa-trash" onclick="deleteTask(${index})"></i></li>
      <li><i class="fa-solid fa-palette" onclick="changeTaskBackground(event, ${index})"></i></li>
    </ul>
  </div>
  `;

  containers[tasksArr[index].status].querySelector(".tasks").innerHTML +=taskHTML;
  increaseCounters(tasksArr[index]?.status);
}

function displayAllTasks() {
  for (var i = 0; i < tasksArr.length; i++) {
    displayTask(i);
  }
}

function increaseCounters(status) {
  countersEl[status].innerHTML = +countersEl[status].innerHTML + 1;
}

function clearForm() {
  statusInput.value = "nextUp";
  categoryInput.value = "education";
  titleInput.value = "";
  descriptionInput.value = "";
}

function deleteTask(index) {
  tasksArr.splice(index, 1);
  setTasksToLocal();
  resetContainers();
  resetCounters();
  displayAllTasks();
}

function resetContainers() {
  for (var key in containers) {
    containers[key].querySelector(".tasks").innerHTML = "";
  }
}

function resetCounters() {
  for (var key in countersEl) {
    countersEl[key].innerHTML = 0;
  }

  for (var key in counters) {
    counters[key] = 0;
  }
}

function getTaskInfo(index) {
  showModal();
  statusInput.value = tasksArr[index].status;
  categoryInput.value = tasksArr[index].category;
  titleInput.value = tasksArr[index].title;
  descriptionInput.value = tasksArr[index].description;

  addBtn.classList.replace("d-block", "d-none");
  updateBtn.classList.replace("d-none", "d-block");
  updatedIndex = index;
}

function updateTask(updatedIndex) {
  tasksArr[updatedIndex].status = statusInput.value;
  tasksArr[updatedIndex].category = categoryInput.value;
  tasksArr[updatedIndex].title = titleInput.value;
  tasksArr[updatedIndex].description = descriptionInput.value;

  resetContainers();
  resetCounters();
  displayAllTasks();

  addBtn.classList.replace("d-none", "d-block");
  updateBtn.classList.replace("d-block", "d-none");
  clearForm();
  hideModal();
}

function generateRandomColor() {
  var color = "#";
  var hexCharsArr = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];
  for (var i = 1; i <= 6; i++) {
    var random = hexCharsArr[Math.trunc(Math.random() * hexCharsArr.length)];
    color += random;
  }
  return `${color}55`;
}

function changeTaskBackground(event, index) {
  var newColor = generateRandomColor();
  tasksArr[index].bgColor = newColor;
  setTasksToLocal();
  event.currentTarget.closest(".task").style.backgroundColor = newColor;
}

function searchTasks() {
  resetContainers();
  resetCounters();
  const term = searchInput.value;
  for (var i = 0; i < tasksArr.length; i++) {
    if (
      tasksArr[i].title.toLowerCase().includes(term.toLowerCase()) ||
      tasksArr[i].category.toLowerCase().includes(term.toLowerCase())
    ) {
      displayTask(i);
    }
  }
}

function changeToBars(){
  gridBtn.classList.remove("active");
  barsBtn.classList.add("active");

  for(var i=0; i<sections.length; i++){
    sections[i].classList.remove("col-md-6","col-lg-4");
    sections[i].style.overflow="auto";
  }

  for(var j=0; j<tasks.length; j++){
    tasks[j].setAttribute("data-view","bars");
  }
}

function changeToGrid(){
  barsBtn.classList.remove("active");
  gridBtn.classList.add("active");

  for(var i=0; i<sections.length; i++){
    sections[i].classList.add("col-md-6","col-lg-4");
    sections[i].style.overflow="";
  }

}

function changeMode(){
  if(mode.classList.contains("fa-sun")){
    root.style.setProperty("--main-black","#d2dff1");
    root.style.setProperty("--sec-black","#161b22");
    mode.classList.replace("fa-sun","fa-moon");
  }else{
    root.style.setProperty("--main-black","#0d1117");
    root.style.setProperty("--sec-black","#161b22");
    mode.classList.replace("fa-moon","fa-sun")
  }
}

function validate(element, regex) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.parentElement.nextElementSibling.classList.replace("d-block","d-none");
    return true;
  }

  element.classList.add("is-invalid");
  element.classList.remove("is-valid");
  element.parentElement.nextElementSibling.classList.replace("d-none","d-block");

  return false;
}

// ! Events
newTaskBtn.addEventListener("click", showModal);
modalEl.addEventListener("click", function (event) {
  if (event.target === event.currentTarget) {
    hideModal();
  }
});
document.addEventListener("keydown", function (event) {
  if (event.code === "Escape") {
    hideModal();
  }
});
addBtn.addEventListener("click", addTask);
updateBtn.addEventListener("click", function () {
  updateTask(updatedIndex);
});
searchInput.addEventListener("input", searchTasks);
barsBtn.addEventListener("click", changeToBars);
gridBtn.addEventListener("click", changeToGrid)
mode.addEventListener("click", changeMode)
descriptionInput.addEventListener("input", function(){
  var char = descriptionInput.value.length;
  console.log(char)
  var charLength = 100 - char;
  console.log(charLength)
  if(char <= 100){
    remainingCounter.innerHTML=`${charLength}`
  }else{
    continer.innerHTML = `your available character finished`;
    descriptionInput.setAttribute("readonly","readonly")
  }
})
titleInput.addEventListener("input", function () {
  validate(titleInput, titleRegex);
});
descriptionInput.addEventListener("input", function () {
  validate(descriptionInput, descRegx);
});