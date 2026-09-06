import React, { useEffect, useState } from "react";
import "./Netejacache.css";

function AutoCacheCleaner() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [usagePercent, setUsagePercent] = useState(0);
  const [usageMB, setUsageMB] = useState(0);
  const [quotaMB, setQuotaMB] = useState(0);
  const [cleaning, setCleaning] = useState(false);
  const [done, setDone] = useState(false);

  // ✅ Converteix bytes a MB o GB de forma llegible
  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  useEffect(() => {
    const checkStorageUsage = async () => {
      const lastCheck = localStorage.getItem("lastCacheCheck");
      const now = new Date();

      // 🕒 Només comprova un cop al dia
       if (lastCheck) {
          const diffHours = (now - new Date(lastCheck)) / (1000 * 60 * 60);
          if (diffHours < 24) {
            console.log("⏱️ La memòria ja s’ha comprovat fa menys d’un dia.");
            return;
          }
        }

      localStorage.setItem("lastCacheCheck", now.toISOString());

      if (!navigator.storage || !navigator.storage.estimate) {
        console.warn("⚠️ El navegador no suporta navigator.storage.estimate()");
        return;
      }

      try {
        const { usage, quota } = await navigator.storage.estimate();
        const percent = (usage / quota) * 100;
        setUsagePercent(percent);
        setUsageMB(usage);
        setQuotaMB(quota);

        console.log(
          `💾 Ús actual CACHÉ: ${formatSize(usage)} de ${formatSize(quota)} (${percent.toFixed(1)}%)`
        );
       // setShowPrompt(true);
        if (percent > 60) setShowPrompt(true);
      } catch (err) {
        console.error("Error comprovant la memòria:", err);
      }
    };

    checkStorageUsage();
  }, []);

  const clearCaches = async () => {
    try {
      setCleaning(true);
      setShowPrompt(false);

      // Esborra dades locals
      localStorage.clear();
      sessionStorage.clear();

      // Neteja cache del navegador
      if ("caches" in window) {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      }

      // Desregistra service workers
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (let reg of regs) {
          await reg.unregister();
        }
      }

      setCleaning(false);
      setDone(true);
      console.log("✅ Caché netejada correctament.");
    } catch (err) {
      console.error("❌ Error durant la neteja:", err);
      setCleaning(false);
    }
  };

  return (
    <>
      {/* Diàleg de confirmació */}
      {showPrompt && (
        <div className="cachecleaner-container">
          <div className="cachecleaner-box">
            <h3>⚠️ Espai gairebé ple</h3>
            <p>
              L’aplicació està usant{" "}
              <strong>{formatSize(usageMB)}</strong> de{" "}
              <strong>{formatSize(quotaMB)}</strong> disponibles (
              {usagePercent.toFixed(1)}%).
            </p>
            <p>Vols netejar la memòria cau per millorar el rendiment?</p>

            <div className="cachecleaner-buttons">
              <button className="yes" onClick={clearCaches}>
                Sí, neteja ara
              </button>
              <button className="no" onClick={() => setShowPrompt(false)}>
                No, més tard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Missatge de procés */}
      {cleaning && (
        <div className="cachecleaner-container">
          <div className="cachecleaner-box">
            <h3>🧹 Netejant memòria cau...</h3>
            <p>Això pot trigar uns segons...</p>
          </div>
        </div>
      )}

      {/* Missatge final */}
      {done && (
        <div className="cachecleaner-container">
          <div className="cachecleaner-box">
            <h3>✅ Neteja completada</h3>
            <button onClick={() => window.location.reload(true)}>
              🔄 Recarregar aplicació
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AutoCacheCleaner;
