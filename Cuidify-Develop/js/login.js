document.querySelector('form').onsubmit = (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const pass = e.target.querySelector('input[type="password"]').value;

    const storedUser = JSON.parse(localStorage.getItem('user_db'));

    if (storedUser && storedUser.email === email && storedUser.pass === pass) {
        // Guardamos una sesión activa simple
        localStorage.setItem('session_active', 'true');
        window.location.href = 'perfil.html';
    } else {
        alert("Credenciales incorrectas. Inténtalo de nuevo.");
    }
};