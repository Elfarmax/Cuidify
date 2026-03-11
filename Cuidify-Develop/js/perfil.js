document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user_db'));

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    renderProfile(user);

    document.getElementById('form-edit-profile').onsubmit = (e) => {
        e.preventDefault();
        
        // Actualizamos objeto
        user.nombre = document.getElementById('edit-nombre').value;
        user.apellidos = document.getElementById('edit-apellidos').value;
        user.bio = document.getElementById('edit-bio').value;
        user.telefono = document.getElementById('edit-phone').value;
        user.precio = document.getElementById('edit-precio').value;

        localStorage.setItem('user_db', JSON.stringify(user));
        renderProfile(user);
        toggleEditMode();
        alert("Perfil actualizado correctamente");
    };
});

function renderProfile(user) {
    // Texto básico
    document.getElementById('display-name').innerText = `${user.nombre} ${user.apellidos}`;
    document.getElementById('display-email').innerText = user.email;
    document.getElementById('display-bio').innerText = user.bio || "Describe tu experiencia profesional aquí para atraer a más clientes.";
    document.getElementById('display-role').innerText = user.role === 'cuidador' ? 'Trabajador' : 'Cliente/Familia';
    
    // Inicial del Avatar
    document.getElementById('avatar-char').innerText = user.nombre.charAt(0).toUpperCase();

    // Campos nuevos o editables
    document.getElementById('display-phone').innerText = user.telefono || "Añadir teléfono";
    document.getElementById('display-precio').innerText = user.precio ? `${user.precio}€/hora` : "No definido";

    // Rellenar formulario
    document.getElementById('edit-nombre').value = user.nombre;
    document.getElementById('edit-apellidos').value = user.apellidos;
    document.getElementById('edit-bio').value = user.bio || "";
    document.getElementById('edit-phone').value = user.telefono || "";
    document.getElementById('edit-precio').value = user.precio || "";
}

function toggleEditMode() {
    const v = document.getElementById('view-mode');
    const e = document.getElementById('edit-mode');
    if (v.style.display === 'none') {
        v.style.display = 'block';
        e.style.display = 'none';
    } else {
        v.style.display = 'none';
        e.style.display = 'block';
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}