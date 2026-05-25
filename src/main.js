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
      const userIndex = deleteBtn.dataset.index;

      users.splice(userIndex, 1);

      localStorage.setItem("users", JSON.stringify(users));

      renderUsers();
    });

    editBtn.addEventListener("click", () => {
      const userIndex = editBtn.dataset.index;

      const selectedUser = users[userIndex];

      editIndex = userIndex;

      renderAuthPage();

      document.getElementById("fullname").value = selectedUser.fullname;

      document.getElementById("email").value = selectedUser.email;

      document.getElementById("birthyear").value = selectedUser.birthyear;

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

    renderAuthPage();
  });
}

function renderAuthPage() {
  document.querySelector("#app").innerHTML = `
  
    <main class="container">

      <h1>CRUD CLAN 4 (MICAELA)</h1>

      <form id="userForm">

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
          type="number" 
          id="birthyear" 
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
          <option value="">Seleccione estado</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>

        <button type="submit">
          Guardar usuario
        </button>

      </form>

      <h2>Login</h2>

      <form id="loginForm">

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

      </form>

    </main>
  `;

  const form = document.getElementById("userForm");

  const loginForm = document.getElementById("loginForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullname = document.getElementById("fullname").value;

    const email = document.getElementById("email").value;

    const birthyear = document.getElementById("birthyear").value;

    const identification = document.getElementById("identification").value;

    const city = document.getElementById("city").value;

    const password = document.getElementById("password").value;

    const status = document.getElementById("status").value;

    const currentYear = new Date().getFullYear();

    if (
      !fullname ||
      !email ||
      !birthyear ||
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

    if (birthyear < 1900 || birthyear > currentYear) {
      alert("Año inválido");
      return;
    }

    const userExists = users.some((user) => {
      return user.identification === identification;
    });

    if (userExists) {
      alert("La identificación ya existe");
      return;
    }

    const age = currentYear - birthyear;

    const user = {
      fullname,
      email,
      birthyear,
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

    localStorage.setItem("users", JSON.stringify(users));

    form.reset();

    alert("Usuario registrado correctamente");
  });

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
}

const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

if (loggedUser) {
  renderDashboard(loggedUser);
} else {
  renderAuthPage();
}
