const fetch = require("node-fetch");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

// --- CONFIGURACIÓ ---
const categories = [
  { id: 9,  name: "Coneixement general" },
  { id: 10, name: "Llibres" },
  { id: 12, name: "Música" },
  { id: 17, name: "Ciència i natura" },
  { id: 21, name: "Esports" },
  { id: 22, name: "Geografia" },
  { id: 23, name: "Història" },
  { id: 25, name: "Art" }
];

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

// --- Funció per obtenir token OpenTDB ---
async function getToken() {
  const r = await fetch("https://opentdb.com/api_token.php?command=request");
  const d = await r.json();
  return d.token;
}

// --- Funció per baixar preguntes OpenTDB (50 per request) ---
async function fetch50(catId, token) {
  const r = await fetch(
    `https://opentdb.com/api.php?amount=50&category=${catId}&type=multiple&token=${token}`
  );
  const d = await r.json();
  return d.results || [];
}

// --- Funció per processar dataset local TriviaQA (JSON) ---
function loadTriviaQA(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Exemples de camp esperat:
  // data[i] = { category, question, answer, incorrect_answers: [] }

  return data
    .filter(q => q.question && q.answer && q.incorrect_answers && q.incorrect_answers.length >= 3)
    .map(q => ({
      categoria: q.category || "TriviaQA",
      pregunta: q.question,
      resposta_1: q.answer,
      resposta_2: q.incorrect_answers[0],
      resposta_3: q.incorrect_answers[1],
      resposta_4: q.incorrect_answers[2]
    }));
}

// --- Funció principal ---
async function main() {
  let records = [];

  console.log("📥 Baixant preguntes OpenTDB...");

  // 1️⃣ Baixar OpenTDB
  for (const cat of categories) {
    console.log(`\n➡ Categoria: ${cat.name}`);
    const token = await getToken();
    let totalCat = 0;
    let finished = false;

    while (!finished) {
      const batch = await fetch50(cat.id, token);
      if (!batch || batch.length === 0) break;

      for (const q of batch) {
        if (!q.question || !q.correct_answer || q.incorrect_answers.length !== 3) continue;

        records.push({
          categoria: cat.name,
          pregunta: q.question,
          resposta_1: q.correct_answer,
          resposta_2: q.incorrect_answers[0],
          resposta_3: q.incorrect_answers[1],
          resposta_4: q.incorrect_answers[2]
        });
        totalCat++;
      }

      await sleep(800); // evita bloquejos
    }

    console.log(`✅ ${cat.name}: ${totalCat} preguntes`);
  }

  // 2️⃣ Afegir preguntes de TriviaQA (dataset local)
  console.log("\n📥 Carregant preguntes TriviaQA...");
  const triviaQAData = loadTriviaQA("triviaqa.json"); // ← posar fitxer JSON local aquí
  console.log(`✅ TriviaQA: ${triviaQAData.length} preguntes`);
  records = records.concat(triviaQAData);

  // 3️⃣ Escriure CSV final
  const csvWriter = createObjectCsvWriter({
    path: "trivia_combined.csv",
    header: [
      { id: "categoria", title: "categoria" },
      { id: "pregunta", title: "pregunta" },
      { id: "resposta_1", title: "resposta_1" },
      { id: "resposta_2", title: "resposta_2" },
      { id: "resposta_3", title: "resposta_3" },
      { id: "resposta_4", title: "resposta_4" }
    ]
  });

  await csvWriter.writeRecords(records);

  console.log(`\n🎉 CSV creat: trivia_combined.csv`);
  console.log(`📊 TOTAL PREGUNTES: ${records.length}`);
}

main().catch(err => console.error("❌ Error:", err));
