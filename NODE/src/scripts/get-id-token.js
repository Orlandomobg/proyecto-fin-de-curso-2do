// Genera un ID token REAL de Firebase a partir de email+password,
// igual que haría el front con signInWithEmailAndPassword.
// Si el usuario no existe en Firebase, lo crea (signUp); si existe, hace login.
//
// Requisitos en .env:
//   FIREBASE_WEB_API_KEY=<Web API Key del proyecto (apiKey del firebaseConfig)>
// Requisito en Firebase Console:
//   Authentication > Sign-in method > Email/Password = HABILITADO
//
// Uso (la contraseña debe tener 6+ caracteres):
//   node scripts/get-id-token.js <email> <password>
require("dotenv").config();

const API_KEY = process.env.FIREBASE_WEB_API_KEY;
const email = process.argv[2];
const password = process.argv[3];

async function call(action, body) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, returnSecureToken: true }),
  });
  return { ok: res.ok, data: await res.json() };
}

async function main() {
  if (!API_KEY) {
    console.error("Falta FIREBASE_WEB_API_KEY en el .env");
    process.exit(1);
  }
  if (!email || !password) {
    console.error("Uso: node scripts/get-id-token.js <email> <password>");
    process.exit(1);
  }

  // 1. intenta registrar (lo que hará el front en el signup)
  let { ok, data } = await call("signUp", { email, password });

  // 2. si ya existía, hace login (lo que hará el front en el login)
  if (!ok && data.error?.message === "EMAIL_EXISTS") {
    console.log("Ese email ya existe en Firebase -> haciendo login...");
    ({ ok, data } = await call("signInWithPassword", { email, password }));
  }

  if (!ok) {
    console.error("Error de Firebase:", data.error);
    process.exit(1);
  }

  console.log("\nUsuario:", data.email, "| uid:", data.localId);
  console.log("\nID TOKEN (válido ~1h). Úsalo como: Authorization: Bearer <token>\n");
  console.log(data.idToken);
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});