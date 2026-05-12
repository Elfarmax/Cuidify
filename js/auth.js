document.addEventListener("DOMContentLoaded", () => {
  const authSection = document.getElementById("auth-section");
  const unauthLinks = document.querySelectorAll(".nav-link-unauthenticated");
  const userSession = JSON.parse(localStorage.getItem("usuario_sesion"));

  if (userSession && authSection) {
    unauthLinks.forEach((link) => {
      link.style.display = "none";
    });

    let menuItems = "";

    if (userSession.role === "cuidador") {
      menuItems = `
        <a href="perfil.html" class="menu-dropdown-item">👤 Mi Perfil</a>
        <a href="lista-profesionales.html" class="menu-dropdown-item">💼 Ofertas de Trabajo</a>
        <a href="mensajes.html" class="menu-dropdown-item">💬 Mensajes</a>
        <a href="ia-ofertas.html" class="menu-dropdown-item">✨ IA Ofertas Recomendadas</a>
      `;
    } else {
      menuItems = `
        <a href="perfil-familia.html" class="menu-dropdown-item">👨‍👩‍👧 Mi Perfil Familiar</a>
        <a href="lista-profesionales.html" class="menu-dropdown-item">🔍 Buscar Cuidadores</a>
        <a href="mensajes.html" class="menu-dropdown-item">💬 Mensajes</a>
        <a href="ia-ofertas.html" class="menu-dropdown-item">✨ IA Cuidadores Recomendados</a>
      `;
    }

    authSection.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <span style="color: var(--primary); font-weight: bold;">👤 Hola, ${userSession.nombre}</span>
        <div class="menu-dropdown-container">
          <button class="menu-dropdown-btn" onclick="toggleMenuDropdown()">☰ Menú</button>
          <div id="menuDropdown" class="menu-dropdown-content">
            ${menuItems}
            <button onclick="logout()" class="menu-dropdown-item menu-logout">🚪 Cerrar Sesión</button>
          </div>
        </div>
      </div>
    `;
  }
});

function toggleMenuDropdown() {
  const dropdown = document.getElementById("menuDropdown");
  if (dropdown) {
    if (dropdown.style.display === "flex") {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "flex";
      dropdown.style.flexDirection = "column";
      dropdown.style.zIndex = "99999";
    }
  }
}

document.addEventListener("click", (event) => {
  const dropdown = document.getElementById("menuDropdown");
  const container = document.querySelector(".menu-dropdown-container");

  if (dropdown && container && !container.contains(event.target)) {
    dropdown.style.display = "none";
  }
});

function logout() {
  localStorage.removeItem("usuario_sesion");
  window.location.href = "index.html";
}
