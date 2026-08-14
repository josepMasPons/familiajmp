const fetch = require("node-fetch");
const { createObjectCsvWriter } = require("csv-writer");

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

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

// 🔑 obtenir token nou
async function getToken() {
  const r = await fetch("https://opentdb.com/api_token.php?command=request");
  const d = await r.json();
  return d.token;
}

// 📥 baixar 50 preguntes
async function fetch50(catId, token) {
  const r = await fetch(
    `https://opentdb.com/api.php?amount=50&category=${catId}&type=multiple&token=${token}`
  );
  const d = await r.json();
  return d.results || [];
}

async function main() {
  let records = [];

  for (const cat of categories) {
    console.log(`\n📥 Baixant categoria: ${cat.name}`);

    const token = await getToken(); // 🔑 token per categoria
    let finished = false;
    let totalCat = 0;

    while (!finished) {
      const batch = await fetch50(cat.id, token);

      if (!batch || batch.length === 0) {
        finished = true;
        break;
      }

      for (const q of batch) {
        if (!q.question || !q.correct_answer || q.incorrect_answers.length !== 3) {
          continue;
        }

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

      console.log(`   → ${totalCat} preguntes`);
      await sleep(800); // evita 429
    }

    console.log(`✅ ${cat.name}: ${totalCat} preguntes`);
  }

  const csvWriter = createObjectCsvWriter({
    path: "opentdb_trivia.csv",
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

  console.log("\n🎉 CSV CREAT: opentdb_trivia.csv");
  console.log(`📊 TOTAL PREGUNTES: ${records.length}`);
}

main().catch(err => {
  console.error("❌ Error:", err);
});
