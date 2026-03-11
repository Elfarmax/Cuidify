// Función para desplazamiento suave a secciones (Anclas)
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Sistema de Accesibilidad
function applyTheme(theme) {
    // Aplicamos la clase al body para que el CSS cambie los colores
    document.getElementById('appBody').className = (theme === 'normal') ? '' : theme;

    // Guardamos la preferencia para que no se pierda al recargar
    localStorage.setItem('themePreference', theme);
}

// Al cargar cualquier página, recuperamos el tema guardado
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('themePreference');
    if (savedTheme) {
        applyTheme(savedTheme);
        // Ajustamos el selector si existe en la página
        const selector = document.querySelector('select[onchange="applyTheme(this.value)"]');
        if (selector) selector.value = savedTheme;
    }
});