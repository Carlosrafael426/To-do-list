/* ===============================
   ELEMENTOS
================================ */
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

const filterAll = document.getElementById("filter-all");
const filterCompleted = document.getElementById("filter-completed");
const filterPending = document.getElementById("filter-pending");
const clearCompletedBtn = document.getElementById("clear-completed");

const sortSelect = document.getElementById("sort-tasks");
const searchInput = document.getElementById("search-tasks");

/* ===============================
   ESTADO
================================ */
let tasks = [];

/* ===============================
   LOCAL STORAGE
================================ */
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasks = () => {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks(tasks);
};

/* ===============================
   CRUD
================================ */
const addTask = (text) => {
  tasks.push({
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  });

  saveTasks();
  renderTasks(tasks);
};

const toggleTask = (id) => {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks(tasks);
};

const deleteTask = (id) => {
  const li = document.querySelector(`li[data-id="${id}"]`);
  if (!li) return;

  li.classList.add("removing");

  setTimeout(() => {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks(tasks);
  }, 250);
};

const clearCompleted = () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks(tasks);
};

/* ===============================
   RENDER
================================ */
const renderTasks = (taskArray) => {
  taskList.innerHTML = "";

  taskArray.forEach((task) => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-card">
        <div class="task-top">
          <input type="checkbox" class="task-check" ${
            task.completed ? "checked" : ""
          } />

          <span class="task-date">
            ${new Date(task.createdAt).toLocaleDateString("pt-BR")}
          </span>

          <button class="delete-btn" title="Excluir tarefa">🗑️</button>
        </div>

        <span class="task-text">${task.text}</span>
      </div>
    `;

    taskList.appendChild(li);
  });
};

/* ===============================
   FILTROS / ORDENAÇÃO / BUSCA
================================ */
const filterTasks = (type) => {
  if (type === "completed")
    return renderTasks(tasks.filter((t) => t.completed));

  if (type === "pending")
    return renderTasks(tasks.filter((t) => !t.completed));

  renderTasks(tasks);
};

const sortTasks = (criteria) => {
  const sorted = [...tasks];

  const sortMap = {
    "date-asc": (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    "date-desc": (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    "alpha-asc": (a, b) => a.text.localeCompare(b.text),
    "alpha-desc": (a, b) => b.text.localeCompare(a.text),
  };

  sorted.sort(sortMap[criteria]);
  renderTasks(sorted);
};

const searchTasks = (query) => {
  renderTasks(
    tasks.filter((task) =>
      task.text.toLowerCase().includes(query.toLowerCase())
    )
  );
};

/* ===============================
   EVENTOS
================================ */
taskForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = taskInput.value.trim();
  if (!value) return;
  addTask(value);
  taskInput.value = "";
});

taskList?.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);

  if (e.target.closest(".delete-btn")) return deleteTask(id);
  if (e.target.classList.contains("task-check")) return toggleTask(id);

  toggleTask(id);
});

filterAll?.addEventListener("click", () => filterTasks("all"));
filterCompleted?.addEventListener("click", () => filterTasks("completed"));
filterPending?.addEventListener("click", () => filterTasks("pending"));
clearCompletedBtn?.addEventListener("click", clearCompleted);

sortSelect?.addEventListener("change", (e) => sortTasks(e.target.value));
searchInput?.addEventListener("input", (e) => searchTasks(e.target.value));

document.addEventListener("DOMContentLoaded", loadTasks);

/* ===============================
   CALENDÁRIO
================================ */
const calendarContainer = document.getElementById("calendar");

calendarContainer &&
  flatpickr(calendarContainer, {
  inline: true,
  dateFormat: "Y-m-d",
  appendTo: calendarContainer,
  static: true,
});


/* ===============================
   SIDEBAR MOBILE
================================ */
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuToggle?.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
});

overlay?.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});

/* ===============================
   CLIMA
================================ */
const weatherCard = document.getElementById("weatherCard");
const weatherIcon = document.getElementById("weatherIcon");
const weatherTemp = document.getElementById("weatherTemp");
const weatherCity = document.getElementById("weatherCity");
const weatherDesc = document.getElementById("weatherDesc");

const WEATHER_STYLES = {
  Clear: { icon: "☀️", gradient: "linear-gradient(135deg,#f7971e,#ffd200)" },
  Clouds: { icon: "☁️", gradient: "linear-gradient(135deg,#757f9a,#d7dde8)" },
  Rain: { icon: "🌧️", gradient: "linear-gradient(135deg,#314755,#26a0da)" },
  Thunderstorm: { icon: "⛈️", gradient: "linear-gradient(135deg,#141e30,#243b55)" },
  Snow: { icon: "❄️", gradient: "linear-gradient(135deg,#83a4d4,#b6fbff)" },
  Drizzle: { icon: "🌦️", gradient: "linear-gradient(135deg,#89f7fe,#66a6ff)" },
  Mist: { icon: "🌫️", gradient: "linear-gradient(135deg,#606c88,#3f4c6b)" },
};

if (weatherCard && navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&lang=pt_br&appid=e2c3b1b1b18a07fc4287b32f61f48e5b`
    )
      .then((res) => res.json())
      .then((data) => {
        const style = WEATHER_STYLES[data.weather[0].main] || WEATHER_STYLES.Clear;
        weatherIcon.textContent = style.icon;
        weatherCard.style.background = style.gradient;
        weatherTemp.textContent = `${Math.round(data.main.temp)}°`;
        weatherCity.textContent = data.name;
        weatherDesc.textContent = data.weather[0].description;
      })
      .catch(() => (weatherDesc.textContent = "Erro ao carregar clima"));
  });
}
