// 1. BASE DE DATOS COMPLETA Y AMPLIADA (20 Profesionales con datos de perfil)
const profesionales = [
  // --- NIÑOS ---
  {
    nombre: "Laura Pérez",
    servicio: "ninos",
    precio: "12€/h",
    rating: "⭐⭐⭐⭐",
    img: "imagenes/CuidadoInfantil.jpg",
    formacion: "Grado en Educación Infantil",
    equipamiento: "Juegos educativos y cuentos",
    logistica: "Coche propio y alzador",
  },
  {
    nombre: "Andrés Gómez",
    servicio: "ninos",
    precio: "15€/h",
    rating: "⭐⭐⭐⭐⭐",
    img: "imagenes/CuidadoInfantil.jpg",
    formacion: "Monitor de Ocio y Tiempo Libre",
    equipamiento: "Material de manualidades",
    logistica: "Disponibilidad tardes",
  },
  {
    nombre: "Lucía Fernández",
    servicio: "ninos",
    precio: "13€/h",
    rating: "⭐⭐⭐⭐",
    img: "imagenes/CuidadoInfantil.jpg",
    formacion: "Técnico en Cuidados Auxiliares",
    equipamiento: "Botiquín primeros auxilios",
    logistica: "Residencia en el centro",
  },
  {
    nombre: "Mateo Ruiz",
    servicio: "ninos",
    precio: "14€/h",
    rating: "⭐⭐⭐⭐⭐",
    img: "imagenes/CuidadoInfantil.jpg",
    formacion: "Estudiante de Magisterio",
    equipamiento: "Libros de apoyo escolar",
    logistica: "Bono transporte activo",
  },
  {
    nombre: "Sofía Castro",
    servicio: "ninos",
    precio: "12€/h",
    rating: "⭐⭐⭐⭐",
    img: "imagenes/CuidadoInfantil.jpg",
    formacion: "Título de Inglés C1",
    equipamiento: "Juegos en inglés",
    logistica: "Horario flexible",
  },

  // --- MAYORES ---
  {
    nombre: "Marta Rivas",
    servicio: "mayores",
    precio: "18€/h",
    rating: "⭐⭐⭐⭐",
    img: "imagenes/CuidadoMayores.jpg",
    formacion: "Auxiliar de Geriatría",
    equipamiento: "Tensiómetro y pulsioxímetro",
    logistica: "Vehículo adaptado",
  },
  {
    nombre: "Roberto Soler",
    servicio: "mayores",
    precio: "20€/h",
    rating: "⭐⭐⭐⭐⭐",
    img: "imagenes/CuidadoMayores.jpg",
    formacion: "Grado en Enfermería",
    equipamiento: "Kit de curas y medicación",
    logistica: "Carnet de conducir",
  },
  {
    nombre: "Julio Méndez",
    servicio: "mayores",
    precio: "19€/h",
    rating: "⭐⭐⭐⭐⭐",
    img: "imagenes/CuidadoMayores.jpg",
    formacion: "Especialista en Alzheimer",
    equipamiento: "Material estimulación cognitiva",
    logistica: "Coche propio",
  },
  {
    nombre: "Carmen Vega",
    servicio: "mayores",
    precio: "17€/h",
    rating: "⭐⭐⭐⭐",
    img: "imagenes/CuidadoMayores.jpg",
    formacion: "Técnico en Atención Sociosanitaria",
    equipamiento: "Grúa de movilización (opcional)",
    logistica: "Residencia cercana",
  },
  {
    nombre: "Elena Sanz",
    servicio: "mayores",
    precio: "18€/h",
    rating: "⭐⭐⭐⭐⭐",
    img: "imagenes/CuidadoMayores.jpg",
    formacion: "Certificado de profesionalidad",
    equipamiento: "Material de aseo especializado",
    logistica: "Disponibilidad 24h",
  },

  // --- MASCOTAS ---
  {
    nombre: "Kira & Co",
    servicio: "mascotas",
    precio: "10€/h",
    rating: "⭐⭐⭐⭐⭐",
    img: "imagenes/CuidadorPerros.webp",
    formacion: "Adiestrador Canino",
    equipamiento: "Correas de entrenamiento",
    logistica: "Furgoneta para transporte",
  },
  {
    nombre: "Juan DogWalker",
    servicio: "mascotas",
    precio: "9€/h",
    rating: "⭐⭐⭐⭐",
    img: "imagenes/CuidadorPerros.webp",
    formacion: "Primeros Auxilios Veterinarios",
    equipamiento: "Bolsas y premios",
    logistica: "Rutas por parques",
  },
  {
    nombre: "Dani Mascotas",
    servicio: "mascotas",
    precio: "11€/h",
    rating: "⭐⭐⭐⭐⭐",
    img: "imagenes/CuidadorPerros.webp",
    formacion: "Peluquería Canina",
    equipamiento: "Máquinas de corte y cepillos",
    logistica: "Coche propio",
  },
  {
    nombre: "Carla Paws",
    servicio: "mascotas",
    precio: "12€/h",
    rating: "⭐⭐⭐⭐",
    img: "imagenes/CuidadorPerros.webp",
    formacion: "Etología Felina/Canina",
    equipamiento: "Juguetes interactivos",
    logistica: "Zonas norte y centro",
  },
  {
    nombre: "Óscar Canino",
    servicio: "mascotas",
    precio: "10€/h",
    rating: "⭐⭐⭐⭐⭐",
    img: "imagenes/CuidadorPerros.webp",
    formacion: "Cuidador de Zoos (Exóticos)",
    equipamiento: "Transportines homologados",
    logistica: "Disponibilidad festivos",
  },

  // --- OTROS ---
  {
    nombre: "Carlos Jardines",
    servicio: "otros",
    precio: "25€/h",
    rating: "⭐⭐⭐⭐",
    img: "imagenes/Servicios.jpg",
    formacion: "Técnico en Jardinería",
    equipamiento: "Cortacésped y herramientas",
    logistica: "Remolque propio",
  },
  {
    nombre: "Elena Limpieza",
    servicio: "otros",
    precio: "15€/h",
    rating: "⭐⭐⭐⭐⭐",
    img: "imagenes/Servicios.jpg",
    formacion: "Experta en Desinfección",
    equipamiento: "Vaporeta y productos ECO",
    logistica: "Coche propio",
  },
  {
    nombre: "Pedro Manitas",
    servicio: "otros",
    precio: "22€/h",
    rating: "⭐⭐⭐⭐",
    img: "imagenes/Servicios.jpg",
    formacion: "Fontanero y Electricista",
    equipamiento: "Caja de herramientas completa",
    logistica: "Desplazamiento incluido",
  },
  {
    nombre: "Sonia Plancha",
    servicio: "otros",
    precio: "14€/h",
    rating: "⭐⭐⭐⭐⭐",
    img: "imagenes/Servicios.jpg",
    formacion: "Costura y Confección",
    equipamiento: "Centro de planchado profesional",
    logistica: "Recogida a domicilio",
  },
  {
    nombre: "Raúl Reformas",
    servicio: "otros",
    precio: "30€/h",
    rating: "⭐⭐⭐⭐",
    img: "imagenes/Servicios.jpg",
    formacion: "Maestro de Obra",
    equipamiento: "Equipamiento de protección",
    logistica: "Camión pequeño",
  },
];

// --- LÓGICA DE RENDERIZADO ---

const serviceOrder = ["mayores", "ninos", "mascotas", "otros"];
const serviceNames = {
  mayores: "Mayores",
  ninos: "Niños",
  mascotas: "Mascotas",
  otros: "Otros Servicios",
};

const urlParams = new URLSearchParams(window.location.search);
let servicioElegido = urlParams.get("servicio");
if (servicioElegido === "shopping") servicioElegido = "otros";
if (!servicioElegido) servicioElegido = "mayores"; // Default to "Mayores" if no service selected
const contenedor = document.getElementById("lista-cards");
const titulo = document.getElementById("titulo-servicio");
const filtroServicio = document.getElementById("filtro-servicio");

function buildProfileCard(p) {
  const infoExtra = `
        <div class="detalles-perfil-tarjeta">
            ${p.formacion ? `<p><span>🎓</span> <b>Formación:</b> ${p.formacion}</p>` : ""}
        </div>
    `;

  return `
        <div class="tarjeta-profesional-exclusiva">
            <img src="${p.img}" alt="${p.nombre}" class="img-profesional-lista">
            <div class="info-profesional-lista">
                <h3>${p.nombre}</h3>
                <p class="txt-precio">Tarifa: <b>${p.precio}</b></p>
                <p class="txt-rating">Valoración: ${p.rating}</p>
                ${infoExtra}
                <button class="btn-contacto-lista" data-profesional-nombre="${p.nombre}">Contactar</button>
            </div>
        </div>
    `;
}

function renderProfiles(profiles) {
  return profiles
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map(buildProfileCard)
    .join("");
}

function renderService(service) {
  if (service && serviceNames[service]) {
    const filtrados = profesionales.filter((p) => p.servicio === service);
    titulo.innerText = `Cuidadores de ${serviceNames[service]}`;
    contenedor.innerHTML = filtrados.length
      ? renderProfiles(filtrados)
      : '<div class="sin-resultados"><p>No hay perfiles para esta categoría.</p></div>';
    return;
  }

  titulo.innerText = "Ofertas de Trabajo";
  contenedor.innerHTML = serviceOrder
    .map((servicio) => {
      const profiles = profesionales.filter((p) => p.servicio === servicio);
      if (!profiles.length) return "";

      return `
                    <section class="categoria-seccion">
                        <h2>${serviceNames[servicio]}</h2>
                        <div class="categoria-cards">
                            ${renderProfiles(profiles)}
                        </div>
                    </section>
                `;
    })
    .join("");
}

function initCategoryFilter() {
  if (!filtroServicio) return;

  filtroServicio.value = servicioElegido || "";

  filtroServicio.addEventListener("change", (event) => {
    const selectedService = event.target.value || "";
    servicioElegido = selectedService;
    renderService(servicioElegido);
  });
}

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
    alert("⚠️ Debes iniciar sesión para contactar con un profesional.");
    window.location.href = "login.html";
    return;
  }

  const mensajes = JSON.parse(localStorage.getItem("mensajes_usuario")) || [];
  const existing = mensajes.find((m) => m.remitente === nombre);

  if (existing) {
    localStorage.setItem("mensajes_abrir", String(existing.id));
    alert(`✅ Ya tienes una conversación con ${nombre}. Te llevo a Mensajes.`);
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
  alert(`✅ Has contactado a ${nombre}. Te llevo a Mensajes.`);
  window.location.href = "mensajes.html";
}

if (!contenedor) {
  console.warn("Contenedor de lista no encontrado");
} else {
  initCategoryFilter();
  renderService(servicioElegido);
  setupContactButtons();
}
