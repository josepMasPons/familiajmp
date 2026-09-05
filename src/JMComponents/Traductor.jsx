import React, { useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import translate from "@vitalets/google-translate-api";

export default function CsvTranslatorEnhanced() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const columnsToTranslate = ["pregunta", "resposta_1", "resposta_2", "resposta_3", "resposta_4"];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTranslate = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;
        const translatedData = [];

        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const translatedRow = { ...row };

          for (const col of columnsToTranslate) {
            const text = row[col];
            if (text) {
              try {
                const res = await translate(text, { from: "en", to: "ca" });
                translatedRow[col] = res.text;
                await new Promise((r) => setTimeout(r, 50)); // petita pausa
              } catch (err) {
                console.error("Error traduïnt:", text, err);
                translatedRow[col] = text;
              }
            }
          }

          translatedData.push(translatedRow);
          setProgress(Math.round(((i + 1) / data.length) * 100));
        }

        const csv = Papa.unparse(translatedData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "translated_trivia.csv");

        setLoading(false);
        alert("✅ Traducció completada! Fitxer: translated_trivia.csv");
      },
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>CSV Translator (English → Català)</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button
        onClick={handleTranslate}
        disabled={loading || !file}
        style={{ marginLeft: "10px" }}
      >
        {loading ? `Traduïnt... ${progress}%` : "Traduir CSV"}
      </button>
      {loading && <div style={{ marginTop: "10px" }}>Progrés: {progress}%</div>}
    </div>
  );
}
