// Función para desplazamiento suave a secciones (Anclas)
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Sistema de Accesibilidad - Mejorado
function applyTheme(theme) {
  const body = document.getElementById("appBody");
  if (!body) {
    console.warn("No se encontró elemento con id 'appBody'");
    return;
  }

  // Eliminar todas las clases de tema
  body.classList.remove("protanopia", "achromatopsia", "high-contrast");

  // Aplicar la nueva clase si no es normal
  if (theme !== "normal" && theme) {
    body.classList.add(theme);
    console.log("Tema aplicado:", theme);
  }

  // Guardamos la preferencia en localStorage
  localStorage.setItem("themePreference", theme);

  // Actualizar el selector si existe
  const selector = document.querySelector(
    'select[onchange="applyTheme(this.value)"]',
  );
  if (selector) {
    selector.value = theme;
  }
}

// Al cargar cualquier página, recuperamos el tema guardado
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("themePreference");

  // Aplicar tema guardado si existe
  if (savedTheme && savedTheme !== "normal") {
    applyTheme(savedTheme);
  }

  // Inicializar el selector con el valor correcto
  const selector = document.querySelector(
    'select[onchange="applyTheme(this.value)"]',
  );
  if (selector) {
    selector.value = savedTheme || "normal";
  }
});

// Comprobar sesión antes de ver cuidadores
function verCuidadores(servicio) {
  const usuario = JSON.parse(localStorage.getItem("usuario_sesion"));
  if (!usuario) {
    alert(
      "⚠️ Necesitas tener una cuenta para ver los cuidadores. ¡Regístrate gratis!",
    );
    window.location.href = "registro.html";
  } else {
    window.location.href = "lista-profesionales.html?servicio=" + servicio;
  }
}
