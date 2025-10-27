import { useState } from "react";
import api from "../api";
import {
  cardSectionStyle,
  sectionTitle,
  sectionNote,
  textAreaStyle,
  primaryButtonStyle,
} from "../styles.js";

interface XmlImportProps {
  onStatusMessage: (message: string) => void;
  onImportSuccess: () => void;
}

export default function XmlImport({
  onStatusMessage,
  onImportSuccess,
}: XmlImportProps) {
  const [xmlText, setXmlText] = useState<string>("");

  async function handleImportXml() {
    try {
      if (!xmlText.trim()) {
        onStatusMessage("Please paste XML first.");
        return;
      }

      const res = await api.post("/api/import", xmlText, {
        headers: { "Content-Type": "application/xml" },
      });

      if (res.status >= 200 && res.status < 300) {
        onStatusMessage("XML imported successfully.");
        setXmlText("");
        onImportSuccess();
      } else {
        onStatusMessage("Import failed.");
      }
    } catch (err) {
      console.error(err);
      onStatusMessage("Import failed.");
    }
  }

  return (
    <section style={cardSectionStyle}>
      <h2 style={sectionTitle}>Import Orders (XML)</h2>
      <p style={sectionNote}>
        Paste XML that matches the provided schema. The server will parse it,
        upsert customers (by CustomerCode), upsert orders (by ReferenceNum), and
        snapshot addresses per order.
      </p>

      <textarea
        value={xmlText}
        onChange={(e) => setXmlText(e.target.value)}
        placeholder={`<?xml version="1.0" encoding="utf-8"?>\n<TransactionRequest>...\n</TransactionRequest>`}
        style={textAreaStyle}
      />

      <button onClick={handleImportXml} style={primaryButtonStyle}>
        Import XML
      </button>
    </section>
  );
}
