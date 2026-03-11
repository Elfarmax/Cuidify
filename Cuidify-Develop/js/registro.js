document.addEventListener('DOMContentLoaded', () => {
    const btnWorker = document.getElementById('tab-worker');
    const btnEmployer = document.getElementById('tab-employer');
    const blockCuidador = document.getElementById('block-cuidador');
    const blockFamilia = document.getElementById('block-familia');
    const selectTarget = document.getElementById('select-target');
    const boxThirdParty = document.getElementById('box-third-party');
    const form = document.getElementById('form-register');

    let currentRole = 'cuidador';

    // Función para alternar pestañas
    btnWorker.onclick = () => {
        currentRole = 'cuidador';
        btnWorker.classList.add('active');
        btnEmployer.classList.remove('active');
        blockCuidador.style.display = 'block';
        blockFamilia.style.display = 'none';
    };

    btnEmployer.onclick = () => {
        currentRole = 'familia';
        btnEmployer.classList.add('active');
        btnWorker.classList.remove('active');
        blockCuidador.style.display = 'none';
        blockFamilia.style.display = 'block';
    };

    // Lógica del desplegable "Para un familiar"
    selectTarget.onchange = (e) => {
        if (e.target.value === 'other') {
            boxThirdParty.classList.add('show');
        } else {
            boxThirdParty.classList.remove('show');
        }
    };

    // Envío del formulario
    form.onsubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.role = currentRole;

        // Guardar en LocalStorage para simular base de datos
        localStorage.setItem('user_db', JSON.stringify(data));

        alert(`¡Registro exitoso! Bienvenido, ${data.nombre}.`);
        window.location.href = 'login.html';
    };
});