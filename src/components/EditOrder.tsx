import { useState, useEffect } from "react";
import api from "../api";
import type { Order, OrderUpdateRequest } from "../types";
import {
  cardSectionStyle,
  sectionTitle,
  twoColGrid,
  inputBlock,
  labelStyle,
  inputStyle,
  errorInputStyle,
  errorTextStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
} from "../styles.js";

type NewLine = { itemNum: string; itemDescription: string };

interface EditOrderProps {
  selectedOrderId: number | null;
  selectedOrder: Order | null;
  onStatusMessage: (message: string) => void;
  onOrderUpdated: () => void;
  onEditComplete: () => void;
}

export default function EditOrder({
  selectedOrderId,
  selectedOrder,
  onStatusMessage,
  onOrderUpdated,
  onEditComplete,
}: EditOrderProps) {
  const [editForm, setEditForm] = useState<OrderUpdateRequest>({});
  const [editLines, setEditLines] = useState<NewLine[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (selectedOrder) {
      // preload editable fields
      setEditForm({
        countryCode: selectedOrder.countryCode,
        firstName: selectedOrder.customer?.firstName,
        lastName: selectedOrder.customer?.lastName,
        phone: selectedOrder.customer?.phone,
        email: selectedOrder.customer?.email,
        fullName: selectedOrder.address?.fullName,
        addressType: selectedOrder.address?.addressType,
        addressLine1: selectedOrder.address?.addressLine1,
        addressLine2: selectedOrder.address?.addressLine2,
      });

      // preload lines
      setEditLines(
        selectedOrder.orderLines && selectedOrder.orderLines.length > 0
          ? selectedOrder.orderLines.map((l) => ({
              itemNum: l.itemNum,
              itemDescription: l.itemDescription,
            }))
          : [{ itemNum: "", itemDescription: "" }]
      );

      setFieldErrors({});
    } else {
      setEditForm({});
      setEditLines([{ itemNum: "", itemDescription: "" }]);
      setFieldErrors({});
    }
  }, [selectedOrder]);

  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleEditLineChange(
    index: number,
    field: keyof NewLine,
    value: string
  ) {
    const copy = [...editLines];
    copy[index] = { ...copy[index], [field]: value };
    setEditLines(copy);
  }

  function addEditLineRow() {
    setEditLines((prev) => [...prev, { itemNum: "", itemDescription: "" }]);
  }

  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateEditForm(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!editForm.countryCode || !editForm.countryCode.trim()) {
      errors.countryCode = "Country Code is required";
    }

    if (!editForm.firstName || !editForm.firstName.trim()) {
      errors.firstName = "First Name is required";
    }

    if (!editForm.lastName || !editForm.lastName.trim()) {
      errors.lastName = "Last Name is required";
    }

    if (!editForm.email || !editForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(editForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!editForm.phone || !editForm.phone.trim()) {
      errors.phone = "Phone is required";
    }

    // fullName (address name) is now optional - no validation needed

    if (!editForm.addressType || !editForm.addressType.trim()) {
      errors.addressType = "Address Type is required";
    }

    if (!editForm.addressLine1 || !editForm.addressLine1.trim()) {
      errors.addressLine1 = "Address Line 1 is required";
    }

    if (!editForm.addressLine2 || !editForm.addressLine2.trim()) {
      errors.addressLine2 = "Address Line 2 is required";
    }

    return errors;
  }

  async function saveEdit() {
    if (selectedOrderId == null) return;

    const errors = validateEditForm();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      onStatusMessage("Please fix the validation errors");
      return;
    }

    try {
      const body: OrderUpdateRequest = {
        ...editForm,
        orderLines: editLines.filter(
          (l) => l.itemNum.trim() !== "" || l.itemDescription.trim() !== ""
        ),
      };

      await api.put(`/api/orders/${selectedOrderId}`, body);
      onStatusMessage("Order updated successfully.");
      onOrderUpdated();

      // Show confirmation message
      setShowConfirmation(true);

      // Close editing box after showing confirmation
      setTimeout(() => {
        setShowConfirmation(false);
        onEditComplete();
      }, 1500);
    } catch (err) {
      console.error(err);
      onStatusMessage("Failed to update order.");
    }
  }

  const getInputStyle = (fieldName: string) =>
    fieldErrors[fieldName] ? errorInputStyle : inputStyle;

  return (
    <section style={cardSectionStyle}>
      <h2 style={sectionTitle}>
        {selectedOrderId ? `Edit Order #${selectedOrderId}` : "Select an order"}
      </h2>

      {/* Confirmation Banner */}
      {showConfirmation && (
        <div
          style={{
            backgroundColor: "#22c55e",
            color: "white",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <span>✓</span>
          <span>Order Updated Successfully!</span>
        </div>
      )}

      {!selectedOrderId ? (
        <p style={{ fontSize: ".8rem", color: "#555" }}>
          Click "Edit" on an order to load it here.
        </p>
      ) : (
        <>
          {/* Editable main fields */}
          <div style={twoColGrid}>
            <div style={inputBlock}>
              <label style={labelStyle}>Country Code *</label>
              <input
                name="countryCode"
                value={editForm.countryCode ?? ""}
                onChange={handleEditChange}
                style={getInputStyle("countryCode")}
              />
              {fieldErrors.countryCode && (
                <div style={errorTextStyle}>{fieldErrors.countryCode}</div>
              )}
            </div>

            <div style={inputBlock}>
              <label style={labelStyle}>First Name *</label>
              <input
                name="firstName"
                value={editForm.firstName ?? ""}
                onChange={handleEditChange}
                style={getInputStyle("firstName")}
              />
              {fieldErrors.firstName && (
                <div style={errorTextStyle}>{fieldErrors.firstName}</div>
              )}
            </div>

            <div style={inputBlock}>
              <label style={labelStyle}>Last Name *</label>
              <input
                name="lastName"
                value={editForm.lastName ?? ""}
                onChange={handleEditChange}
                style={getInputStyle("lastName")}
              />
              {fieldErrors.lastName && (
                <div style={errorTextStyle}>{fieldErrors.lastName}</div>
              )}
            </div>

            <div style={inputBlock}>
              <label style={labelStyle}>Phone *</label>
              <input
                name="phone"
                value={editForm.phone ?? ""}
                onChange={handleEditChange}
                style={getInputStyle("phone")}
              />
              {fieldErrors.phone && (
                <div style={errorTextStyle}>{fieldErrors.phone}</div>
              )}
            </div>

            <div style={inputBlock}>
              <label style={labelStyle}>Email *</label>
              <input
                name="email"
                type="email"
                value={editForm.email ?? ""}
                onChange={handleEditChange}
                style={getInputStyle("email")}
              />
              {fieldErrors.email && (
                <div style={errorTextStyle}>{fieldErrors.email}</div>
              )}
            </div>

            <div style={inputBlock}>
              <label style={labelStyle}>Address Name</label>
              <input
                name="fullName"
                value={editForm.fullName ?? ""}
                onChange={handleEditChange}
                style={inputStyle}
              />
            </div>

            <div style={inputBlock}>
              <label style={labelStyle}>Address Type *</label>
              <select
                name="addressType"
                value={editForm.addressType ?? ""}
                onChange={handleEditChange}
                style={getInputStyle("addressType")}
              >
                <option value="">Select Type</option>
                <option value="HOME">Home</option>
                <option value="WORK">Work</option>
                <option value="BILLING">Billing</option>
                <option value="SHIPPING">Shipping</option>
                <option value="OTHER">Other</option>
              </select>
              {fieldErrors.addressType && (
                <div style={errorTextStyle}>{fieldErrors.addressType}</div>
              )}
            </div>

            <div style={inputBlock}>
              <label style={labelStyle}>Address Line 1 *</label>
              <input
                name="addressLine1"
                value={editForm.addressLine1 ?? ""}
                onChange={handleEditChange}
                style={getInputStyle("addressLine1")}
              />
              {fieldErrors.addressLine1 && (
                <div style={errorTextStyle}>{fieldErrors.addressLine1}</div>
              )}
            </div>

            <div style={inputBlock}>
              <label style={labelStyle}>Address Line 2 *</label>
              <input
                name="addressLine2"
                value={editForm.addressLine2 ?? ""}
                onChange={handleEditChange}
                style={getInputStyle("addressLine2")}
              />
              {fieldErrors.addressLine2 && (
                <div style={errorTextStyle}>{fieldErrors.addressLine2}</div>
              )}
            </div>
          </div>

          {/* Editable order lines */}
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                fontSize: ".8rem",
                fontWeight: 500,
                marginBottom: ".5rem",
              }}
            >
              Order Lines (optional)
            </div>

            {editLines.map((line, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: ".5rem",
                  marginBottom: ".5rem",
                }}
              >
                <input
                  placeholder="Item Num"
                  value={line.itemNum}
                  onChange={(e) =>
                    handleEditLineChange(idx, "itemNum", e.target.value)
                  }
                  style={inputStyle}
                />
                <input
                  placeholder="Item Description"
                  value={line.itemDescription}
                  onChange={(e) =>
                    handleEditLineChange(idx, "itemDescription", e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
            ))}

            <button onClick={addEditLineRow} style={secondaryButtonStyle}>
              + Add Line
            </button>
          </div>

          <button
            onClick={saveEdit}
            style={{
              ...primaryButtonStyle,
              width: "100%",
              marginTop: "1rem",
            }}
          >
            Save Changes
          </button>
        </>
      )}
    </section>
  );
}
