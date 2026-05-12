require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "casacuidadoDB",
  password: process.env.DB_PASSWORD || "HR",
  port: process.env.DB_PORT || 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error(
      "Error adquiriendo el cliente de la base de datos",
      err.stack,
    );
  }
  console.log("Conexión a PostgreSQL establecida con éxito");
  release();
});

// =========================================
// RUTA DE REGISTRO
// =========================================
app.post("/register", async (req, res) => {
  const {
    nombre,
    apellidos,
    dni,
    email,
    password_hash,
    telefono,
    rol,
    bio,
    precio_hora,
    habilidades,
  } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const userQuery = `
      INSERT INTO usuarios (nombre, apellidos, dni, email, password_hash, telefono, rol, bio, precio_hora)
      VALUES (
        $1, $2,
        pgp_sym_encrypt($3, 'clave_secreta_tfg'),
        pgp_sym_encrypt($4, 'clave_secreta_tfg'),
        crypt($5, gen_salt('bf')),
        pgp_sym_encrypt($6, 'clave_secreta_tfg'),
        $7, $8, $9
      )
      RETURNING id, nombre, apellidos, rol, bio, precio_hora
    `;
    const values = [
      nombre,
      apellidos,
      dni || "",
      email,
      password_hash,
      telefono || "",
      rol,
      bio,
      precio_hora || 0,
    ];
    console.log("Intentando registrar usuario:", email);
    const userRes = await client.query(userQuery, values);
    const newUser = userRes.rows[0];
    if (habilidades && Array.isArray(habilidades) && habilidades.length > 0) {
      const skillQuery =
        "INSERT INTO atributos_usuario (usuario_id, tipo, valor) VALUES ($1, $2, $3)";
      for (let skill of habilidades) {
        await client.query(skillQuery, [newUser.id, "habilidad", skill]);
      }
    }
    await client.query("COMMIT");
    console.log("Registro completado con éxito para:", newUser.nombre);
    res
      .status(200)
      .json({ message: "Usuario registrado correctamente", user: newUser });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error crítico en el registro:", err.message);
    res
      .status(500)
      .json({
        error: "Error interno en la base de datos",
        detail: err.message,
      });
  } finally {
    client.release();
  }
});

// =========================================
// RUTA DE LOGIN
// =========================================
app.post("/login", async (req, res) => {
  const { email, password_hash } = req.body;
  try {
    const query = `
      SELECT id, nombre, apellidos, rol, bio, precio_hora,
        pgp_sym_decrypt(email, 'clave_secreta_tfg') AS email,
        pgp_sym_decrypt(telefono, 'clave_secreta_tfg') AS telefono,
        pgp_sym_decrypt(dni, 'clave_secreta_tfg') AS dni
      FROM usuarios
      WHERE pgp_sym_decrypt(email, 'clave_secreta_tfg') = $1
      AND password_hash = crypt($2, password_hash)
    `;
    const result = await pool.query(query, [email, password_hash]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(401).json({ error: "Email o contraseña incorrectos" });
    }
  } catch (err) {
    console.error("Error en el login:", err.message);
    res.status(500).json({ error: "Error en el servidor durante el login" });
  }
});

// =========================================
// RUTAS DE VALORACIONES
// =========================================

app.get("/valoraciones/todas", async (req, res) => {
  try {
    const query = `
      SELECT * FROM valoraciones 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error al obtener valoraciones:", err.message);
    res.status(500).json({ error: "Error al obtener las valoraciones" });
  }
});

app.get("/valoraciones/:cuidador_id", async (req, res) => {
  const { cuidador_id } = req.params;
  try {
    const query = `
      SELECT * FROM valoraciones 
      WHERE cuidador_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [cuidador_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error al obtener valoraciones:", err.message);
    res.status(500).json({ error: "Error al obtener las valoraciones" });
  }
});

// GUARDAR VALORACIÓN - CORREGIDO
app.post("/valoraciones", async (req, res) => {
  const { cuidador_id, autor_nombre, puntuacion, comentario } = req.body;

  if (!autor_nombre || !puntuacion || !comentario) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const query = `
      INSERT INTO valoraciones (cuidador_id, autor_nombre, puntuacion, comentario)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    // Usamos null si el ID no viene definido o es inválido
    const values = [
      cuidador_id || null,
      autor_nombre,
      parseInt(puntuacion),
      comentario,
    ];

    const result = await pool.query(query, values);
    res.status(200).json({ message: "Valoración guardada", valoracion: result.rows[0] });
  } catch (err) {
    console.error("Error detallado al guardar valoración:", err.message);
    res.status(500).json({ error: "Error al guardar la valoración", detail: err.message });
  }
});

// =========================================
// INICIO DEL SERVIDOR
// =========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`-----------------------------------------`);
  console.log(`Servidor CasaCuidadoPro corriendo en:`);
  console.log(`http://localhost:${PORT}`);
  console.log(`-----------------------------------------`);
});

// =========================================
// ASISTENTE DE IA (GROQ - MODELO LLAMA 3.1)
// =========================================

// 1. Función de protección de datos
function anonimizar(texto) {
  if (!texto) return "";
  return texto
    .replace(/\b\d{9}\b/g, "[teléfono]")
    .replace(/\S+@\S+\.\S+/g, "[email]");
}

// 2. Ruta del Chat con Groq (Alta disponibilidad)
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!message) {
      return res.status(400).json({ error: "No se envió ningún mensaje." });
    }

    if (!apiKey) {
      console.error("Falta GROQ_API_KEY en el archivo .env");
      return res.status(500).json({ error: "Configuración de IA no encontrada." });
    }

    const mensajeLimpio = anonimizar(message);

    // MODELO: llama-3.1-8b-instant (Sustituye al antiguo 3.0 que dio error)
    const MODELO_ACTUAL = "llama-3.1-8b-instant";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODELO_ACTUAL,
        messages: [
          {
            role: "system",
            content: "Eres el asistente virtual de Cuidify. Eres experto en apoyo al cuidado de personas mayores y niños. Responde de forma amable, empática y muy breve (máximo 3 frases)."
          },
          {
            role: "user",
            content: mensajeLimpio
          }
        ],
        temperature: 0.6, // Un poco más bajo para ser más preciso
        max_tokens: 300
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error desde Groq:", data.error?.message);
      return res.status(response.status).json({
        error: "El servicio de IA está saturado",
        details: data.error?.message
      });
    }

    const textoIA = data.choices?.[0]?.message?.content;

    if (!textoIA) {
      throw new Error("Respuesta vacía del motor de IA");
    }

    // Enviamos la respuesta limpia al frontend
    return res.json({ response: textoIA.trim() });

  } catch (error) {
    console.error("ERROR EN EL PROCESO DE CHAT:", error.message);
    return res.status(500).json({
      error: "Hubo un error al procesar tu mensaje. Inténtalo de nuevo."
    });
  }
});