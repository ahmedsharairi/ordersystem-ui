import React from "react";

// Common styles for components
export const cardSectionStyle: React.CSSProperties = {
  background: "white",
  borderRadius: "8px",
  padding: "1rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  border: "1px solid #eee",
};

export const sectionTitle: React.CSSProperties = {
  margin: "0 0 .5rem 0",
  fontSize: "1rem",
  fontWeight: 600,
};

export const sectionNote: React.CSSProperties = {
  fontSize: ".8rem",
  margin: "0 0 .5rem 0",
  lineHeight: 1.4,
  color: "#444",
};

export const textAreaStyle: React.CSSProperties = {
  width: "100%",
  height: "120px",
  fontSize: ".8rem",
  fontFamily: "monospace",
  padding: ".5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  resize: "vertical",
  marginBottom: ".5rem",
};

export const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: "#222",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: ".5rem .75rem",
  fontSize: ".9rem",
  cursor: "pointer",
};

export const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: "#eee",
  color: "#222",
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: ".4rem .5rem",
  fontSize: ".8rem",
  cursor: "pointer",
};

export const twoColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: ".5rem",
};

export const inputBlock: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

export const labelStyle: React.CSSProperties = {
  fontSize: ".7rem",
  color: "#444",
  marginBottom: ".25rem",
  fontWeight: 500,
};

export const inputStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: ".4rem .5rem",
  fontSize: ".8rem",
  width: "100%",
};

export const errorInputStyle: React.CSSProperties = {
  ...inputStyle,
  border: "1px solid #d32f2f",
  backgroundColor: "#ffeaea",
};

export const errorTextStyle: React.CSSProperties = {
  color: "#d32f2f",
  fontSize: ".7rem",
  marginTop: ".25rem",
};

export const minorText: React.CSSProperties = {
  color: "#777",
  fontSize: ".7rem",
};

export const tableHeadRowStyle: React.CSSProperties = {
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  backgroundColor: "#fafafa",
};

export const thCell: React.CSSProperties = {
  padding: ".5rem",
  textAlign: "left",
  fontWeight: 600,
  fontSize: ".75rem",
  color: "#444",
  borderBottom: "1px solid #ddd",
};

export const tdCell: React.CSSProperties = {
  padding: ".5rem",
  verticalAlign: "top",
  fontSize: ".8rem",
  borderBottom: "1px solid #eee",
};

export const miniButtonDark: React.CSSProperties = {
  backgroundColor: "#222",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: ".25rem .5rem",
  fontSize: ".7rem",
  cursor: "pointer",
  marginRight: ".25rem",
};

export const miniButtonDanger: React.CSSProperties = {
  backgroundColor: "#c62828",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: ".25rem .5rem",
  fontSize: ".7rem",
  cursor: "pointer",
};
