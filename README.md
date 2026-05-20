<div align="center">
<br>
🤝 CasaCuidadoPRO
Conecta a familias con cuidadores profesionales de confianza
<br>
Mostrar imagen
Mostrar imagen
Mostrar imagen
<br>

Cuidify es una plataforma web que facilita la búsqueda y contratación de cuidadores profesionales para mayores, niños y mascotas — con un asistente de inteligencia artificial integrado para guiar a las familias en cada paso.

<br>
</div>

¿Qué es CasaCuidadoPRO?
Encontrar un cuidador de confianza es una de las decisiones más importantes que toma una familia. Cuidify nace para simplificar ese proceso: un espacio donde los cuidadores muestran su experiencia y certificaciones, y donde las familias pueden contactarlos, leer valoraciones reales y recibir recomendaciones personalizadas gracias a la IA.
El proyecto fue desarrollado como Trabajo de Fin de Grado, con especial atención a la privacidad de los datos, la accesibilidad visual y una experiencia de usuario clara y humana.

✨ Funcionalidades principales
Para familias

Explora perfiles detallados de cuidadores con bio, precio por hora y habilidades
Filtra por distancia, precio y tipo de servicio
Contacta directamente mediante mensajería interna
Lee y escribe valoraciones reales de otros usuarios
Recibe sugerencias personalizadas del asistente de IA

Para cuidadores

Crea un perfil profesional con tus certificados y especialidades
Recibe ofertas de trabajo adaptadas a tus preferencias mediante IA
Gestiona tus conversaciones con familias desde un solo lugar
Construye tu reputación a través de valoraciones verificadas

Para todos

Asistente virtual con IA disponible en todo momento para resolver dudas sobre el cuidado de personas
Modos de accesibilidad en todas las páginas: estándar, daltonismo, achromatopsia y alto contraste
Datos protegidos: la información sensible (DNI, teléfono, email) se almacena cifrada en la base de datos


🖥️ Páginas de la plataforma
PáginaDescripciónInicioPresentación de la plataforma y acceso principalRegistro / LoginAlta como familia o cuidador profesionalLista de profesionalesBúsqueda y filtrado de cuidadores disponiblesPerfil del cuidadorInformación, habilidades y valoracionesMensajesComunicación directa entre familias y cuidadoresOfertas con IARecomendaciones de trabajo personalizadasServiciosTipos de cuidado disponibles en la plataformaAyuda y soportePreguntas frecuentes y contacto

🛠️ Tecnologías utilizadas
Cuidify está construido con una arquitectura sencilla pero robusta, pensada para ser mantenible y escalar sin complejidad innecesaria.

Frontend — HTML, CSS y JavaScript puro, sin frameworks
Backend — Node.js con Express como servidor de API
Base de datos — PostgreSQL con cifrado de datos sensibles mediante pgcrypto
Inteligencia Artificial — Groq (Llama 3.1) para el chat y Google Generative AI para las ofertas personalizadas
Seguridad — Contraseñas hasheadas con bcrypt, limitación de peticiones y variables de entorno


🚀 Puesta en marcha
Requisitos previos

Node.js v18 o superior
PostgreSQL 14 o superior

Instalación
bash# Clonar el repositorio
git clone https://github.com/tu-usuario/cuidify.git
cd cuidify

# Instalar dependencias
npm install

# Crear e inicializar la base de datos
psql -U postgres -c "CREATE DATABASE casacuidadoDB;"
psql -U postgres -d casacuidadoDB -f casacuidado_final.sql

# Configurar las variables de entorno
cp .env.example .env
# Edita .env con tus credenciales (ver sección siguiente)

# Arrancar el servidor
node js/server.js
Abre index.html en tu navegador y ya tienes Cuidify funcionando localmente.

⚙️ Variables de entorno
Crea un archivo .env en la raíz del proyecto con el siguiente contenido:
envDB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=casacuidadoDB
DB_HOST=localhost
DB_PORT=5432

GROQ_API_KEY=tu_api_key_de_groq
Puedes obtener una clave de Groq de forma gratuita en console.groq.com.

⚠️ Importante: No subas el archivo .env al repositorio. Asegúrate de que esté incluido en .gitignore.


♿ Accesibilidad
Cuidify incluye un selector de tema visual disponible en el encabezado de todas las páginas, con cuatro modos:

👁️ Estándar — Apariencia por defecto
🎨 Daltonismo — Ajuste de color para protanopia
⬛ Achromatopsia — Escala de grises con mayor contraste
🌓 Alto contraste — Fondo oscuro y texto de alta legibilidad

La preferencia del usuario se guarda automáticamente y se mantiene entre sesiones.

📄 Licencia
Este proyecto se distribuye bajo la licencia ISC. Consulta el archivo LICENSE para más información.

<div align="center">
Desarrollado con ❤️ como Trabajo de Fin de Grado
</div>
