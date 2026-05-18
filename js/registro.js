document.addEventListener("DOMContentLoaded", () => {
  const btnWorker = document.getElementById("tab-worker");
  const btnEmployer = document.getElementById("tab-employer");
  const blockCuidador = document.getElementById("block-cuidador");
  const blockFamilia = document.getElementById("block-familia");
  const selectTarget = document.getElementById("select-target");
  const boxThirdParty = document.getElementById("box-third-party");
  const form = document.getElementById("form-register");

  let currentRole = "cuidador";

  // Gestión de Roles
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

  // Mostrar/ocultar datos del familiar
  if (selectTarget) {
    selectTarget.onchange = (e) => {
      if (e.target.value === "other") {
        boxThirdParty.style.display = "block";
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

    // Validar categoria si es cuidador
    if (currentRole === "cuidador" && !rawData.categoria_servicio) {
      alert("Por favor selecciona una categoria de servicio.");
      return;
    }

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
      categoria_servicio: rawData.categoria_servicio || null,
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
        const userData = await response.json();

        const sesion = {
          id: userData.user?.id || null,
          nombre: payload.nombre,
          apellidos: payload.apellidos,
          email: payload.email,
          role: payload.rol,
          bio: payload.bio,
          telefono: payload.telefono,
          precio: payload.precio_hora,
          categoria_servicio: payload.categoria_servicio,
        };

        localStorage.setItem("usuario_sesion", JSON.stringify(sesion));

        // Guardar en lista de profesionales si es cuidador
        if (currentRole === "cuidador") {
          guardarProfesionalAlRegistrarse(sesion);
        }

        alert("Bienvenido/a a CasaCuidadoPro!");

        if (currentRole === "cuidador") {
          window.location.href = "perfil.html";
        } else {
          window.location.href = "perfil-familia.html";
        }
      } else {
        const err = await response.json();
        alert("Error: " + (err.detail || err.message || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error:", error);

      const sesion = {
        id: null,
        nombre: payload.nombre,
        apellidos: payload.apellidos,
        email: payload.email,
        role: payload.rol,
        bio: payload.bio,
        telefono: payload.telefono,
        precio: payload.precio_hora,
        categoria_servicio: payload.categoria_servicio,
      };

      localStorage.setItem("usuario_sesion", JSON.stringify(sesion));

      if (currentRole === "cuidador") {
        guardarProfesionalAlRegistrarse(sesion);
        window.location.href = "perfil.html";
      } else {
        window.location.href = "perfil-familia.html";
      }
    }
  };
});

function guardarProfesionalAlRegistrarse(sesion) {
  const profesional = {
    id: sesion.email,
    nombre: `${sesion.nombre} ${sesion.apellidos || ""}`.trim(),
    servicio: sesion.categoria_servicio || "otros",
    precio: sesion.precio ? `${sesion.precio} euros/h` : "A consultar",
    rating: "Nuevo",
    img: getImagenPorCategoria(sesion.categoria_servicio),
    formacion: "",
    equipamiento: "",
    esUsuario: true,
  };

  const lista =
    JSON.parse(localStorage.getItem("profesionales_usuarios")) || [];
  const index = lista.findIndex((p) => p.id === profesional.id);

  if (index >= 0) {
    lista[index] = profesional;
  } else {
    lista.push(profesional);
  }

  localStorage.setItem("profesionales_usuarios", JSON.stringify(lista));
}

function getImagenPorCategoria(categoria) {
  const imagenes = {
    mayores: "imagenes/CuidadoMayores.jpg",
    ninos: "imagenes/CuidadoInfantil.jpg",
    mascotas: "imagenes/CuidadorPerros.webp",
    otros: "imagenes/Servicios.jpg",
  };
  return imagenes[categoria] || "imagenes/CuidadoMayores.jpg";
}
