document.addEventListener("DOMContentLoaded", () => {
  const btnWorker = document.getElementById("tab-worker");
  const btnEmployer = document.getElementById("tab-employer");
  const blockCuidador = document.getElementById("block-cuidador");
  const blockFamilia = document.getElementById("block-familia");
  const selectTarget = document.getElementById("select-target");
  const boxThirdParty = document.getElementById("box-third-party");
  const form = document.getElementById("form-register");

  let currentRole = "cuidador";

  // Gestión de Roles (Tabs)
  btnWorker.onclick = () => {
    currentRole = "cuidador";
    btnWorker.classList.add("active");
    btnEmployer.classList.remove("active");
    blockCuidador.style.display = "block";
    blockFamilia.style.display = "none";
  };

  btnEmployer.onclick = () => {
    currentRole = "familia";
    btnEmployer.classList.add("active");
    btnWorker.classList.remove("active");
    blockCuidador.style.display = "none";
    blockFamilia.style.display = "block";
  };

  // Lógica para mostrar/ocultar datos del familiar
  if (selectTarget) {
    selectTarget.onchange = (e) => {
      if (e.target.value === "other") {
        boxThirdParty.style.display = "block";
        // Pequeño delay para que la transición CSS funcione
        setTimeout(() => boxThirdParty.classList.add("show"), 10);
      } else {
        boxThirdParty.classList.remove("show");
        setTimeout(() => (boxThirdParty.style.display = "none"), 400);
      }
    };
  }

  // Envío del Formulario
  form.onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    // Objeto final para enviar a PostgreSQL
    const payload = {
      nombre: rawData.nombre,
      apellidos: rawData.apellidos,
      dni: rawData.dni,
      email: rawData.email,
      password_hash: rawData.password_hash,
      telefono: rawData.telefono,
      rol: currentRole,
      bio: rawData.bio || "",
      precio_hora: rawData.precio_hora ? parseFloat(rawData.precio_hora) : 0,
      // Datos extra de familia (opcionales según tu lógica de negocio)
      nombre_familiar: rawData.nombre_familiar || null,
      parentesco: rawData.parentesco || null,
      edad_familiar: rawData.edad_familiar || null,
      ubicacion: rawData.ubicacion || null,
    };

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        localStorage.setItem("usuario_sesion", JSON.stringify(payload));
        alert("¡Bienvenido/a a CasaCuidadoPro!");
        window.location.href = "perfil.html";
      } else {
        const err = await response.json();
        alert("Error: " + err.message);
      }
    } catch (error) {
      console.error("Error:", error);
      // Simulación para desarrollo
      localStorage.setItem("usuario_sesion", JSON.stringify(payload));
      window.location.href = "perfil.html";
    }
  };
});
