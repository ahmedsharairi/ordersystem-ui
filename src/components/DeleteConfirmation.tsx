import type { Order } from "../types";
import {
  cardSectionStyle,
  sectionTitle,
  primaryButtonStyle,
  secondaryButtonStyle,
  minorText,
} from "../styles.js";

interface DeleteConfirmationProps {
  order: Order;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmation({
  order,
  onConfirm,
  onCancel,
}: DeleteConfirmationProps) {
  return (
    <section style={cardSectionStyle}>
      <h2 style={sectionTitle}>Confirm Delete</h2>

      <div style={{ marginBottom: "1rem" }}>
        <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
          Are you sure you want to delete this order? This action cannot be
          undone.
        </p>

        <div
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #e9ecef",
            borderRadius: "6px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ marginBottom: "0.5rem" }}>
            <strong>Order ID:</strong> {order.orderId}
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong>Reference:</strong> {order.referenceNum}
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong>Customer:</strong> {order.customer?.firstName}{" "}
            {order.customer?.lastName}
          </div>
          <div>
            <strong>Email:</strong>{" "}
            <span style={minorText}>{order.customer?.email}</span>
          </div>
        </div>
      </div>

      <div
        style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}
      >
        <button onClick={onCancel} style={secondaryButtonStyle}>
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            ...primaryButtonStyle,
            backgroundColor: "#dc2626",
          }}
        >
          Delete Order
        </button>
      </div>
    </section>
  );
}
