
import Dexie from "https://unpkg.com/dexie@latest/dist/dexie.mjs";


/* =========================
   DATABASE
========================= */

const db = new Dexie("TaskPlannerDB");

db.version(1).stores({
  tasks: "++id,key,text,completed"
});



/* =========================
   STATIC DATA
========================= */

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const hours = [...Array(24)].map((_, i) =>
  `${String(i).padStart(2, "0")}:00`
);



/* =========================
   DOM
========================= */

const planner = document.getElementById("planner");

const modal = document.getElementById("modal");

const modalDay =
  document.getElementById("modalDay");

const taskInput =
  document.getElementById("taskInput");

const saveBtn =
  document.getElementById("saveBtn");



/* =========================
   STATE
========================= */

let selectedKey = "";

let tasks = {};



/* =========================
   LOAD TASKS
========================= */

async function loadTasks() {

  const allTasks =
    await db.tasks.toArray();

  tasks = {};



  allTasks.forEach(task => {

    if (!tasks[task.key]) {
      tasks[task.key] = [];
    }

    tasks[task.key].push(task);

  });



  renderPlanner();

}



/* =========================
   RENDER
========================= */

function renderPlanner() {

  planner.innerHTML = `

    <div class="header">
      Time
    </div>

    ${days.map(day => `

      <div class="header">
        ${day}
      </div>

    `).join("")}

  `;



  hours.forEach(hour => {

    planner.innerHTML += `

      <div class="time">
        ${hour}
      </div>

    `;



    days.forEach(day => {

      const key = `${day}-${hour}`;

      tasks[key] ||= [];



      planner.innerHTML += `

        <div
          class="cell"
          onclick="openModal('${key}')"
        >

          ${tasks[key].map((task, index) => `

            <div
              class="task ${task.completed ? "completed" : ""}"
            >

              <div class="task-top">

                <div class="task-text">
                  ${task.text}
                </div>

                <div class="task-buttons">

                  <button
                    class="complete-btn"
                    onclick="
                      event.stopPropagation();
                      toggleTask('${key}', ${index})
                    "
                  >
                    ✓
                  </button>

                  <button
                    class="edit-btn"
                    onclick="
                      event.stopPropagation();
                      editTask('${key}', ${index})
                    "
                  >
                    Edit
                  </button>

                  <button
                    class="delete-btn"
                    onclick="
                      event.stopPropagation();
                      deleteTask('${key}', ${index})
                    "
                  >
                    X
                  </button>

                </div>

              </div>

            </div>

          `).join("")}

        </div>

      `;

    });

  });

}



/* =========================
   MODAL
========================= */

function openModal(key) {

  selectedKey = key;

  modal.style.display = "flex";

  modalDay.innerText = key;

  taskInput.value = "";

}

window.openModal = openModal;



function closeModal() {

  modal.style.display = "none";

}



/* =========================
   ADD TASK
========================= */

saveBtn.addEventListener(
  "click",
  async () => {

    const text =
      taskInput.value.trim();

    if (!text) return;



    await db.tasks.add({

      key: selectedKey,

      text,

      completed: false

    });



    closeModal();

    await loadTasks();

  }
);



/* =========================
   TOGGLE TASK
========================= */

async function toggleTask(
  key,
  index
) {

  const task =
    tasks[key][index];



  await db.tasks.update(task.id, {

    completed: !task.completed

  });



  await loadTasks();

}

window.toggleTask = toggleTask;



/* =========================
   EDIT TASK
========================= */

async function editTask(
  key,
  index
) {

  const task =
    tasks[key][index];



  const updated = prompt(
    "Edit Task",
    task.text
  );



  if (
    updated === null ||
    updated.trim() === ""
  ) {
    return;
  }



  await db.tasks.update(task.id, {

    text: updated.trim()

  });



  await loadTasks();

}

window.editTask = editTask;



/* =========================
   DELETE TASK
========================= */

async function deleteTask(
  key,
  index
) {

  const task =
    tasks[key][index];



  await db.tasks.delete(task.id);



  await loadTasks();

}

window.deleteTask = deleteTask;



/* =========================
   INITIAL LOAD
========================= */

loadTasks();