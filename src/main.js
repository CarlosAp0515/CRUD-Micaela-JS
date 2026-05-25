import "./style.css";

const users = JSON.parse(localStorage.getItem("users")) || [];
let editIndex = null;

function renderUsers() {
  const container = document.getElementById("usersContainer");

  container.innerHTML = "";

  users.forEach((user, index) => {
    const card = document.createElement("div");

    card.innerHTML = `
      <div class="card">

        <h2>${user.fullname}</h2>

        <p>Email: ${user.email}</p>

        <p>Edad: ${user.age}</p>

        <p>Identificación: ${user.identification}</p>

        <p>Ciudad: ${user.city}</p>

        <p>Estado: ${user.status}</p>

        <div class="actions">

          <button 
            class="delete"
            data-index="${index}"
          >
            Eliminar
          </button>

          <button 
            class="edit"
            data-index="${index}"
          >
            Editar
          </button>

        </div>

      </div>
    `;

    container.appendChild(card);

    const deleteBtn = card.querySelector(".delete");
    const editBtn = card.querySelector(".edit");

    deleteBtn.addEventListener("click", () => {
      const userIndex = Number(deleteBtn.dataset.index);

      users.splice(userIndex, 1);

      localStorage.setItem("users", JSON.stringify(users));

      renderUsers();
    });

    editBtn.addEventListener("click", () => {
      const userIndex = Number(editBtn.dataset.index);

      const selectedUser = users[userIndex];

      editIndex = userIndex;

      renderRegisterPage();

      document.getElementById("fullname").value = selectedUser.fullname;

      document.getElementById("email").value = selectedUser.email;

      document.getElementById("birthdate").value = selectedUser.birthdate;

      document.getElementById("identification").value =
        selectedUser.identification;

      document.getElementById("city").value = selectedUser.city;

      document.getElementById("password").value = selectedUser.password;

      document.getElementById("status").value = selectedUser.status;
    });
  });
}

function renderDashboard(user) {
  document.querySelector("#app").innerHTML = `
  
    <main class="container">

      <h1>
        Bienvenid@ ${user.fullname}
      </h1>

      <button id="logout">
        Cerrar sesión
      </button>

      <section id="usersContainer">

      </section>

    </main>
  `;

  renderUsers();

  const logoutBtn = document.getElementById("logout");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedUser");

    renderLoginPage();
  });
}

function renderLoginPage() {
  document.querySelector("#app").innerHTML = `

    <main class="container">

      <form id="loginForm">

        <h1>Bienvenido</h1>

        <p class="subtitle">
          Inicia sesión para continuar
        </p>

        <input
          type="text"
          id="loginIdentification"
          placeholder="Identificación"
        />

        <input
          type="password"
          id="loginPassword"
          placeholder="Contraseña"
        />

        <button type="submit">
          Iniciar sesión
        </button>

        <p class="switch-text">
          ¿No tienes cuenta?

          <span id="goRegister">
            Regístrate
          </span>
        </p>

      </form>

    </main>
  `;

  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const loginIdentification = document.getElementById(
      "loginIdentification",
    ).value;

    const loginPassword = document.getElementById("loginPassword").value;

    const foundUser = users.find((user) => {
      return (
        user.identification === loginIdentification &&
        user.password === loginPassword
      );
    });

    if (foundUser) {
      localStorage.setItem("loggedUser", JSON.stringify(foundUser));

      renderDashboard(foundUser);
    } else {
      alert("Identificación o contraseña incorrecta");
    }
  });

  const goRegister = document.getElementById("goRegister");

  goRegister.addEventListener("click", () => {
    renderRegisterPage();
  });
}

function renderRegisterPage() {
  document.querySelector("#app").innerHTML = `

    <main class="container">

      <form id="userForm">

        <h1>Crear cuenta</h1>

        <p class="subtitle">
          Regístrate para comenzar
        </p>

        <input 
          type="text" 
          id="fullname" 
          placeholder="Nombre completo"
        />

        <input 
          type="email" 
          id="email" 
          placeholder="Correo electrónico"
        />

        <input 
          type="date" 
          id="birthdate" 
          placeholder="Año de nacimiento"
        />

        <input 
          type="text" 
          id="identification" 
          placeholder="Número de identificación"
        />

        <input 
          type="text" 
          id="city" 
          placeholder="Ciudad"
        />

        <input 
          type="password" 
          id="password"
          placeholder="Contraseña"
        />

        <select id="status">
          <option value="">
            Seleccione estado
          </option>

          <option value="Activo">
            Activo
          </option>

          <option value="Inactivo">
            Inactivo
          </option>
        </select>

        <button type="submit">
          Crear cuenta
        </button>

        <p class="switch-text">
          ¿Ya tienes cuenta?

          <span id="goLogin">
            Inicia sesión
          </span>
        </p>

      </form>

    </main>
  `;

  const form = document.getElementById("userForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullname = document.getElementById("fullname").value;

    const email = document.getElementById("email").value;

    const birthdate = document.getElementById("birthdate").value;

    const identification = document.getElementById("identification").value;

    const city = document.getElementById("city").value;

    const password = document.getElementById("password").value;

    const status = document.getElementById("status").value;

    const currentYear = new Date().getFullYear();

    if (
      !fullname ||
      !email ||
      !birthdate ||
      !identification ||
      !city ||
      !password ||
      !status
    ) {
      alert("Todos los campos son obligatorios");

      return;
    }

    if (!email.includes("@")) {
      alert("Correo inválido");

      return;
    }

    const birthYear = new Date(birthdate).getFullYear();

    if (birthYear < 1900 || birthYear > currentYear) {
      alert("Fecha inválida");

      return;
    }

    const userExists = users.some((user, index) => {
      return user.identification === identification && index !== editIndex;
    });

    if (userExists) {
      alert("La identificación ya existe");

      return;
    }

    const age = currentYear - birthYear;

    const user = {
      fullname,
      email,
      birthdate,
      age,
      identification,
      city,
      password,
      status,
    };

    if (editIndex === null) {
      users.push(user);
    } else {
      users[editIndex] = user;

      editIndex = null;
    }

    localStorage.setItem("users", JSON.stringify(users));

    alert("Usuario registrado correctamente");

    renderLoginPage();
  });

  const goLogin = document.getElementById("goLogin");

  goLogin.addEventListener("click", () => {
    renderLoginPage();
  });
}

const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

if (loggedUser) {
  renderDashboard(loggedUser);
} else {
  renderLoginPage();
}
