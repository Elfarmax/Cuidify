document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está autenticado
  const userSession = JSON.parse(localStorage.getItem("usuario_sesion"));
  if (!userSession) {
    window.location.href = "login.html";
    return;
  }

  // Cargar mensajes del localStorage
  loadMessages();

  // Event listeners para los filtros
  document.getElementById("max-distance").addEventListener("input", (e) => {
    document.getElementById("distance-value").textContent =
      e.target.value + " km";
  });

  document.getElementById("min-salary").addEventListener("input", (e) => {
    document.getElementById("salary-value").textContent =
      e.target.value + "€/hora";
  });
});

// Simulamos una lista de mensajes de ejemplo
const mensajesEjemplo = [
  {
    id: 1,
    remitente: "María López",
    avatar: "M",
    asunto: "Disponibilidad para cuidar a mi padre",
    mensaje:
      "Hola, vi tu perfil y me interesa contratar tus servicios para el cuidado de mi padre. ¿Cuál es tu disponibilidad?",
    fecha: "2024-04-05",
    leido: false,
    archivado: false,
  },
  {
    id: 2,
    remitente: "Juan García",
    avatar: "J",
    asunto: "Consulta sobre servicios",
    mensaje:
      "Necesito ayuda con limpieza de mi casa. ¿Tienes experiencia? ¿Cuál es tu tarifa?",
    fecha: "2024-04-04",
    leido: true,
    archivado: false,
  },
  {
    id: 3,
    remitente: "Ana Martínez",
    avatar: "A",
    asunto: "Oferta de trabajo disponible",
    mensaje:
      "Tengo una oportunidad de trabajo que se ajusta a tu perfil. Interesado en conocer más detalles?",
    fecha: "2024-04-03",
    leido: true,
    archivado: false,
  },
];

function loadMessages() {
  // Obtener mensajes del localStorage o usar los de ejemplo
  let mensajes =
    JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;

  // Guardar los mensajes de ejemplo si no existen
  if (!localStorage.getItem("mensajes_usuario")) {
    localStorage.setItem("mensajes_usuario", JSON.stringify(mensajesEjemplo));
  }

  renderMessages(mensajes, "todos");
  updateFilterCounts(mensajes);
}

function renderMessages(mensajes, filtro) {
  const lista = document.getElementById("mensajes-lista");

  // Filtrar según el criterio
  let mensajesFiltrados = mensajes;
  if (filtro === "noLeidos") {
    mensajesFiltrados = mensajes.filter((m) => !m.leido);
  } else if (filtro === "archivados") {
    mensajesFiltrados = mensajes.filter((m) => m.archivado);
  }

  if (mensajesFiltrados.length === 0) {
    lista.innerHTML = `
      <div style="text-align: center; color: #999; padding: 40px 20px;">
        <p style="font-size: 1.1rem;">📭 No hay mensajes</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = mensajesFiltrados
    .map(
      (mensaje) => `
    <div onclick="openMessage(${mensaje.id})" 
         style="padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; background: ${!mensaje.leido ? "#f0f4ff" : "#fff"};"
         onmouseover="this.style.backgroundColor='#fafbfc'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'"
         onmouseout="this.style.backgroundColor='${!mensaje.leido ? "#f0f4ff" : "#fff"}'; this.style.boxShadow='none'">
      
      <div style="display: flex; gap: 15px; align-items: flex-start;">
        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #6e8efb, #5a75e6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; flex-shrink: 0;">
          ${mensaje.avatar}
        </div>
        
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <h3 style="margin: 0; font-weight: ${!mensaje.leido ? "700" : "600"}; color: var(--text-main);">
              ${mensaje.remitente}
              ${!mensaje.leido ? '<span style="color: #2563eb; font-size: 0.8rem; margin-left: 8px;">● Nuevo</span>' : ""}
            </h3>
            <span style="color: #999; font-size: 0.85rem;">${formatDate(mensaje.fecha)}</span>
          </div>
          <p style="margin: 8px 0; font-weight: 500; color: var(--text-main);">${mensaje.asunto}</p>
          <p style="margin: 0; color: #666; font-size: 0.9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${mensaje.mensaje}
          </p>
        </div>

        <div style="display: flex; gap: 8px; flex-shrink: 0;">
          ${!mensaje.archivado ? `<button onclick="archiveMessage(event, ${mensaje.id})" class="btn-outline" style="padding: 6px 12px; font-size: 0.8rem;">📦 Archivar</button>` : ""}
          <button onclick="deleteMessage(event, ${mensaje.id})" class="btn-outline" style="padding: 6px 12px; font-size: 0.8rem; color: #ff6b6b;">🗑️ Eliminar</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

function openMessage(id) {
  const mensajes =
    JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;
  const mensaje = mensajes.find((m) => m.id === id);

  if (mensaje) {
    // Marcar como leído
    mensaje.leido = true;
    localStorage.setItem("mensajes_usuario", JSON.stringify(mensajes));

    // Mostrar modal
    const modal = document.getElementById("mensajeModal");
    const contenido = document.getElementById("modal-mensaje-contenido");

    contenido.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #6e8efb, #5a75e6); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 2rem;">
          ${mensaje.avatar}
        </div>
        <h2 style="margin: 0 0 5px 0; font-size: 1.5rem;">${mensaje.remitente}</h2>
        <span style="color: #999; font-size: 0.9rem;">${formatDate(mensaje.fecha)}</span>
      </div>

      <div style="border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; padding-bottom: 15px;">
        <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">${mensaje.asunto}</h3>
      </div>

      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; line-height: 1.6; color: #475569;">
        ${mensaje.mensaje}
      </div>

      <div style="display: flex; gap: 10px;">
        <button onclick="replyMessage(${mensaje.id})" class="btn-primary" style="flex: 1; padding: 12px;">
          ✉️ Responder
        </button>
        <button onclick="cerrarMensajeModal()" class="btn-outline" style="flex: 1; padding: 12px;">
          Cerrar
        </button>
      </div>
    `;

    modal.style.display = "flex";
    loadMessages(); // Recargar para actualizar el estado leído
  }
}

function cerrarMensajeModal() {
  document.getElementById("mensajeModal").style.display = "none";
}

function archiveMessage(event, id) {
  event.stopPropagation();
  const mensajes =
    JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;
  const mensaje = mensajes.find((m) => m.id === id);

  if (mensaje) {
    mensaje.archivado = true;
    localStorage.setItem("mensajes_usuario", JSON.stringify(mensajes));
    loadMessages();
  }
}

function deleteMessage(event, id) {
  event.stopPropagation();
  if (confirm("¿Deseas eliminar este mensaje?")) {
    let mensajes =
      JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;
    mensajes = mensajes.filter((m) => m.id !== id);
    localStorage.setItem("mensajes_usuario", JSON.stringify(mensajes));
    loadMessages();
  }
}

function filterMessages(filtro) {
  // Actualizar botones activos
  document.querySelectorAll('[id^="filter-"]').forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  });

  document.getElementById(`filter-${filtro}`).classList.add("btn-primary");
  document.getElementById(`filter-${filtro}`).classList.remove("btn-outline");

  // Cargar y renderizar
  const mensajes =
    JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;
  renderMessages(mensajes, filtro);
}

function updateFilterCounts(mensajes) {
  const totalNoLeidos = mensajes.filter((m) => !m.leido).length;
  const totalArchivados = mensajes.filter((m) => m.archivado).length;

  document.getElementById("filter-todos").textContent =
    `Todos (${mensajes.length})`;
  document.getElementById("filter-noLeidos").textContent =
    `Sin Leer (${totalNoLeidos})`;
  document.getElementById("filter-archivados").textContent =
    `Archivados (${totalArchivados})`;
}

function replyMessage(id) {
  const mensajes =
    JSON.parse(localStorage.getItem("mensajes_usuario")) || mensajesEjemplo;
  const mensaje = mensajes.find((m) => m.id === id);

  if (mensaje) {
    alert(
      `Respuesta a ${mensaje.remitente}:\n\nFuncionalidad de respuesta próximamente disponible.`,
    );
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Ayer";
  } else {
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  }
}

// Cerrar modal al hacer clic fuera
window.onclick = (event) => {
  const modal = document.getElementById("mensajeModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
