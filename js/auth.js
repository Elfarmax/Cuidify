document.addEventListener("DOMContentLoaded", () => {
  const authSection = document.getElementById("auth-section");
  const unauthLinks = document.querySelectorAll(".nav-link-unauthenticated");
  // UNIFICADO: usamos 'usuario_sesion'
  const userSession = JSON.parse(localStorage.getItem("usuario_sesion"));

  if (userSession && authSection) {
    // Ocultar enlaces de usuarios sin autenticar
    unauthLinks.forEach((link) => {
      link.style.display = "none";
    });

    authSection.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="color: var(--primary); font-weight: bold;">👤 Hola, ${userSession.nombre}</span>
                <div class="menu-dropdown-container">
                    <button class="menu-dropdown-btn" onclick="toggleMenuDropdown()">☰ Menú</button>
                    <div id="menuDropdown" class="menu-dropdown-content">
                        <a href="perfil.html" class="menu-dropdown-item">👤 Mi Perfil</a>
                        <a href="lista-profesionales.html" class="menu-dropdown-item">💼 Ofertas de Trabajo</a>
                        <a href="mensajes.html" class="menu-dropdown-item">💬 Mensajes</a>
                        <a href="ia-ofertas.html" class="menu-dropdown-item">✨ IA Ofertas Recomendadas</a>
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
    dropdown.style.display =
      dropdown.style.display === "flex" ? "none" : "flex";
  }
}

// Cerrar el menú si se hace clic fuera de él
document.addEventListener("click", (event) => {
  const dropdown = document.getElementById("menuDropdown");
  const btn = document.querySelector(".menu-dropdown-btn");

  if (
    dropdown &&
    btn &&
    !dropdown.contains(event.target) &&
    !btn.contains(event.target)
  ) {
    dropdown.style.display = "none";
  }
});

function logout() {
  localStorage.removeItem("usuario_sesion");
  window.location.href = "index.html";
}
