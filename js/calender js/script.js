import Dexie from "https://unpkg.com/dexie@latest/dist/dexie.mjs";

const db=new Dexie("TaskPlannerDB");

db.version(1).stores({
  tasks:"++id,key,text,completed"
});

const days=[
  "Monday","Tuesday","Wednesday",
  "Thursday","Friday","Saturday","Sunday"
];

const hours=[...Array(24)].map((_,i)=>
  `${String(i).padStart(2,"0")}:00`
);

const planner=document.getElementById("planner");

const modal=document.getElementById("modal");
const modalDay=document.getElementById("modalDay");
const taskInput=document.getElementById("taskInput");

const saveBtn=document.getElementById("saveBtn");
const closeModalBtn=document.getElementById("closeModalBtn");

const weekBtn=document.getElementById("weekBtn");
const weekModal=document.getElementById("weekModal");
const weekTasks=document.getElementById("weekTasks");
const closeWeekBtn=document.getElementById("closeWeekBtn");

const searchBtn=document.getElementById("searchBtn");
const searchModal=document.getElementById("searchModal");
const closeSearchBtn=document.getElementById("closeSearchBtn");
const searchInput=document.getElementById("searchInput");
const searchResults=document.getElementById("searchResults");

let selectedKey="";
let tasks={};


/* LOAD */

async function loadTasks(){

  const allTasks=
    await db.tasks.toArray();

  tasks={};

  allTasks.forEach(task=>{

    tasks[task.key] ||= [];

    tasks[task.key].push(task);

  });

  renderPlanner();

}


/* RENDER */

function renderPlanner(){

  planner.innerHTML=`
    <div class="header">
      Time
    </div>

    ${days.map(day=>
      `<div class="header">${day}</div>`
    ).join("")}
  `;

  hours.forEach(hour=>{

    planner.innerHTML += `
      <div class="time">
        ${hour}
      </div>
    `;

    days.forEach(day=>{

      const key=
        `${day}-${hour}`;

      tasks[key] ||= [];

      planner.innerHTML += `

        <div
          class="cell"
          data-key="${key}"
        >

          ${tasks[key].map((task,index)=>`

            <div class="task ${task.completed?"completed":""}">

              <div class="task-top">

                <div class="task-text">
                  ${task.text}
                </div>

                <div class="task-buttons">

                  <button
                    class="complete-btn"
                    data-action="toggle"
                    data-key="${key}"
                    data-index="${index}"
                  >
                    ✓
                  </button>

                  <button
                    class="edit-btn"
                    data-action="edit"
                    data-key="${key}"
                    data-index="${index}"
                  >
                    Edit
                  </button>

                  <button
                    class="delete-btn"
                    data-action="delete"
                    data-key="${key}"
                    data-index="${index}"
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


/* MODAL */

function openModal(key){

  selectedKey=key;

  modal.style.display="flex";

  modalDay.innerText=key;

  taskInput.value="";

}

function closeModal(){
  modal.style.display="none";
}


/* ADD TASK */

async function addTask(){

  const text=
    taskInput.value.trim();

  if(!text) return;

  await db.tasks.add({
    key:selectedKey,
    text,
    completed:false
  });

  closeModal();

  await loadTasks();

}


/* TOGGLE */

async function toggleTask(key,index){

  const task=
    tasks[key][index];

  await db.tasks.update(task.id,{
    completed:!task.completed
  });

  await loadTasks();

}


/* EDIT */

async function editTask(key,index){

  const task=
    tasks[key][index];

  const updated=prompt(
    "Edit Task",
    task.text
  );

  if(
    updated===null ||
    updated.trim()===""
  ) return;

  await db.tasks.update(task.id,{
    text:updated.trim()
  });

  await loadTasks();

}


/* DELETE */

async function deleteTask(key,index){

  const task=
    tasks[key][index];

  await db.tasks.delete(task.id);

  await loadTasks();

}


/* WEEK TASKS */

async function viewWeekTasks(){

  const allTasks=
    await db.tasks.toArray();

  allTasks.sort((a,b)=>
    a.key.localeCompare(b.key)
  );

  weekTasks.innerHTML=
    allTasks.map(task=>`

      <div class="week-task">

        <div>
          <strong>${task.key}</strong>
        </div>

        <div>
          ${task.text}
        </div>

        <div>
          ${
            task.completed
            ? "Completed"
            : "Pending"
          }
        </div>

      </div>

    `).join("");

  weekModal.style.display="flex";

}


/* SEARCH */

async function searchTasks(query=""){

  const allTasks=
    await db.tasks.toArray();

  const filtered=
    allTasks.filter(task=>

      task.text
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )

    );

  filtered.sort((a,b)=>
    a.key.localeCompare(b.key)
  );

  searchResults.innerHTML=

    filtered.map(task=>`

      <div class="week-task">

        <div>
          <strong>${task.key}</strong>
        </div>

        <div>
          ${task.text}
        </div>

        <div>
          ${
            task.completed
            ? "Completed"
            : "Pending"
          }
        </div>

      </div>

    `).join("");

}


/* GRID EVENTS */

planner.addEventListener(
  "click",
  async e=>{

    const cell=
      e.target.closest(".cell");

    if(
      cell &&
      !e.target.dataset.action
    ){
      openModal(
        cell.dataset.key
      );
    }

    const action=
      e.target.dataset.action;

    if(!action) return;

    const key=
      e.target.dataset.key;

    const index=
      e.target.dataset.index;

    if(action==="toggle"){
      await toggleTask(key,index);
    }

    if(action==="edit"){
      await editTask(key,index);
    }

    if(action==="delete"){
      await deleteTask(key,index);
    }

  }
);


/* BUTTON EVENTS */

saveBtn.addEventListener(
  "click",
  addTask
);

closeModalBtn.addEventListener(
  "click",
  closeModal
);
console.log(closeModalBtn);
console.log(searchInput);
console.log(searchBtn);

weekBtn.addEventListener(
  "click",
  viewWeekTasks
);

closeWeekBtn.addEventListener(
  "click",
  ()=>{
    weekModal.style.display="none";
  }
);

searchBtn.addEventListener(
  "click",
  async()=>{

    searchModal.style.display=
      "flex";

    searchInput.value="";

    await searchTasks();

  }
);


closeSearchBtn.addEventListener(
  "click",
  ()=>{
    searchModal.style.display="none";
  }
);

searchInput.addEventListener(
  "input",
  async e=>{

    await searchTasks(
      e.target.value
    );

  }
);


/* INIT */

loadTasks();