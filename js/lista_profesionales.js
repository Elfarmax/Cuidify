// 1. BASE DE DATOS ESTÁTICA
const profesionalesEstaticos = [
  // --- NIÑOS ---
  {
    nombre: "Laura Pérez",
    servicio: "ninos",
    precio: "12€/h",
    rating: "4/5",
    formacion: "Grado en Educación Infantil",
  },
  {
    nombre: "Andrés Gómez",
    servicio: "ninos",
    precio: "15€/h",
    rating: "5/5",
    formacion: "Monitor de Ocio y Tiempo Libre",
  },
  {
    nombre: "Lucía Fernández",
    servicio: "ninos",
    precio: "13€/h",
    rating: "4/5",
    formacion: "Técnico en Cuidados Auxiliares",
  },
  {
    nombre: "Mateo Ruiz",
    servicio: "ninos",
    precio: "14€/h",
    rating: "5/5",
    formacion: "Estudiante de Magisterio",
  },
  {
    nombre: "Sofía Castro",
    servicio: "ninos",
    precio: "12€/h",
    rating: "4/5",
    formacion: "Título de Inglés C1",
  },

  // --- MAYORES ---
  {
    nombre: "Marta Rivas",
    servicio: "mayores",
    precio: "18€/h",
    rating: "4/5",
    formacion: "Auxiliar de Geriatría",
  },
  {
    nombre: "Roberto Soler",
    servicio: "mayores",
    precio: "20€/h",
    rating: "5/5",
    formacion: "Grado en Enfermería",
  },
  {
    nombre: "Julio Méndez",
    servicio: "mayores",
    precio: "19€/h",
    rating: "5/5",
    formacion: "Especialista en Alzheimer",
  },
  {
    nombre: "Carmen Vega",
    servicio: "mayores",
    precio: "17€/h",
    rating: "4/5",
    formacion: "Técnico en Atención Sociosanitaria",
  },
  {
    nombre: "Elena Sanz",
    servicio: "mayores",
    precio: "18€/h",
    rating: "5/5",
    formacion: "Certificado de profesionalidad",
  },

  // --- MASCOTAS ---
  {
    nombre: "Kira & Co",
    servicio: "mascotas",
    precio: "10€/h",
    rating: "5/5",
    formacion: "Adiestrador Canino",
  },
  {
    nombre: "Juan DogWalker",
    servicio: "mascotas",
    precio: "9€/h",
    rating: "4/5",
    formacion: "Primeros Auxilios Veterinarios",
  },
  {
    nombre: "Dani Mascotas",
    servicio: "mascotas",
    precio: "11€/h",
    rating: "5/5",
    formacion: "Peluquería Canina",
  },
  {
    nombre: "Carla Paws",
    servicio: "mascotas",
    precio: "12€/h",
    rating: "4/5",
    formacion: "Etología Felina/Canina",
  },
  {
    nombre: "Óscar Canino",
    servicio: "mascotas",
    precio: "10€/h",
    rating: "5/5",
    formacion: "Cuidador de Zoos (Exóticos)",
  },

  // --- OTROS ---
  {
    nombre: "Carlos Jardines",
    servicio: "otros",
    precio: "25€/h",
    rating: "4/5",
    formacion: "Técnico en Jardinería",
  },
  {
    nombre: "Elena Limpieza",
    servicio: "otros",
    precio: "15€/h",
    rating: "5/5",
    formacion: "Experta en Desinfección",
  },
  {
    nombre: "Pedro Manitas",
    servicio: "otros",
    precio: "22€/h",
    rating: "4/5",
    formacion: "Fontanero y Electricista",
  },
  {
    nombre: "Sonia Plancha",
    servicio: "otros",
    precio: "14€/h",
    rating: "5/5",
    formacion: "Costura y Confección",
  },
  {
    nombre: "Raúl Reformas",
    servicio: "otros",
    precio: "30€/h",
    rating: "4/5",
    formacion: "Maestro de Obra",
  },
];

// 2. CARGAR USUARIOS REGISTRADOS
const profesionalesUsuarios =
  JSON.parse(localStorage.getItem("profesionales_usuarios")) || [];

// 3. COMBINAR
const profesionales = [...profesionalesEstaticos, ...profesionalesUsuarios];

// 4. CONFIGURACIÓN
const serviceOrder = ["mayores", "ninos", "mascotas", "otros"];
const serviceNames = {
  mayores: "Mayores",
  ninos: "Niños",
  mascotas: "Mascotas",
  otros: "Otros Servicios",
};
const serviceIcons = {
  mayores: "👴",
  ninos: "👶",
  mascotas: "🐾",
  otros: "🔧",
};

const colores = [
  ["#6e8efb", "#5a75e6"],
  ["#f093fb", "#f5576c"],
  ["#4facfe", "#00f2fe"],
  ["#43e97b", "#38f9d7"],
  ["#fa709a", "#fee140"],
  ["#a18cd1", "#fbc2eb"],
  ["#fccb90", "#d57eeb"],
  ["#84fab0", "#8fd3f4"],
];

function getGradient(nombre) {
  const idx = nombre.charCodeAt(0) % colores.length;
  return colores[idx];
}

const urlParams = new URLSearchParams(window.location.search);
let servicioElegido = urlParams.get("servicio");
if (servicioElegido === "shopping") servicioElegido = "otros";
if (!servicioElegido) servicioElegido = "mayores";

const contenedor = document.getElementById("lista-cards");
const titulo = document.getElementById("titulo-servicio");
const filtroServicio = document.getElementById("filtro-servicio");

// 5. CONSTRUIR TARJETA
function buildProfileCard(p) {
  const [c1, c2] = getGradient(p.nombre);
  const letra = p.nombre.charAt(0).toUpperCase();

  const badge = p.esUsuario
    ? `<span class="badge-nuevo">NUEVO</span>`
    : p.rating
      ? `<span class="badge-rating">⭐ ${p.rating}</span>`
      : "";

  return `
    <div class="tarjeta-pro-nueva">
      <div class="avatar-pro" style="background: linear-gradient(135deg, ${c1}, ${c2}); box-shadow: 0 6px 18px ${c1}55;">
        ${letra}
      </div>

      <div class="info-pro">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span class="nombre-pro">${p.nombre}</span>
          ${badge}
        </div>
        ${
          p.formacion && p.formacion !== "Sin especificar"
            ? `<p class="formacion-pro">🎓 ${p.formacion}</p>`
            : ""
        }
        <span class="precio-pro" style="background: ${c1}18; color: ${c1}; border: 1px solid ${c1}33;">
          💶 ${p.precio}
        </span>
      </div>

      <button
        class="btn-contactar-pro btn-contacto-lista"
        data-profesional-nombre="${p.nombre}"
        style="background: linear-gradient(135deg, ${c1}, ${c2}); box-shadow: 0 6px 18px ${c1}44;"
      >Contactar</button>
    </div>
  `;
}

// 6. RENDER LISTA
function renderProfiles(profiles) {
  return profiles
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map(buildProfileCard)
    .join("");
}

// 7. RENDER POR SERVICIO
function renderService(service) {
  if (service && serviceNames[service]) {
    const filtrados = profesionales.filter((p) => p.servicio === service);
    titulo.innerText = `${serviceIcons[service]} Cuidadores de ${serviceNames[service]}`;
    contenedor.innerHTML = filtrados.length
      ? renderProfiles(filtrados)
      : `<div style="text-align:center; padding:60px 20px; color:#94a3b8;">
           <div style="font-size:3rem; margin-bottom:16px;">🔍</div>
           <p style="font-size:1rem;">No hay profesionales en esta categoría aún.</p>
         </div>`;
    return;
  }

  titulo.innerText = "Ofertas de Trabajo";
  contenedor.innerHTML = serviceOrder
    .map((servicio) => {
      const profiles = profesionales.filter((p) => p.servicio === servicio);
      if (!profiles.length) return "";
      return `
        <section class="categoria-seccion">
          <h2>${serviceIcons[servicio]} ${serviceNames[servicio]}</h2>
          ${renderProfiles(profiles)}
        </section>
      `;
    })
    .join("");
}

// 8. FILTRO
function initCategoryFilter() {
  if (!filtroServicio) return;
  filtroServicio.value = servicioElegido || "";
  filtroServicio.addEventListener("change", (e) => {
    servicioElegido = e.target.value || "";
    renderService(servicioElegido);
  });
}

// 9. BOTONES CONTACTAR
function setupContactButtons() {
  if (!contenedor) return;
  contenedor.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-contacto-lista");
    if (!button) return;
    event.stopPropagation();
    const nombre = button.dataset.profesionalNombre?.trim();
    if (!nombre) return;
    contactProfessional(nombre);
  });
}

function contactProfessional(nombre) {
  const userSession = JSON.parse(localStorage.getItem("usuario_sesion"));
  if (!userSession) {
    alert("Debes iniciar sesión para contactar con un profesional.");
    window.location.href = "login.html";
    return;
  }

  const mensajes = JSON.parse(localStorage.getItem("mensajes_usuario")) || [];
  const existing = mensajes.find((m) => m.remitente === nombre);

  if (existing) {
    localStorage.setItem("mensajes_abrir", String(existing.id));
    alert(`Ya tienes una conversación con ${nombre}. Te llevo a Mensajes.`);
    window.location.href = "mensajes.html";
    return;
  }

  const nuevoMensaje = {
    id: Date.now(),
    remitente: nombre,
    avatar: nombre.charAt(0).toUpperCase(),
    asunto: `Interés en tus servicios`,
    mensaje: "",
    fecha: new Date().toISOString().split("T")[0],
    leido: false,
    archivado: false,
    respuestas: [],
  };

  mensajes.push(nuevoMensaje);
  localStorage.setItem("mensajes_usuario", JSON.stringify(mensajes));
  localStorage.setItem("mensajes_abrir", String(nuevoMensaje.id));
  alert(`Has contactado a ${nombre}. Te llevo a Mensajes.`);
  window.location.href = "mensajes.html";
}

// 10. INIT
if (!contenedor) {
  console.warn("Contenedor de lista no encontrado");
} else {
  initCategoryFilter();
  renderService(servicioElegido);
  setupContactButtons();
}
