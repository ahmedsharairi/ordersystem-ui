import { useState } from "react";
import api from "../api";
import {
  cardSectionStyle,
  sectionTitle,
  twoColGrid,
  inputStyle,
  errorInputStyle,
  errorTextStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
} from "../styles.js";

type NewLine = { itemNum: string; itemDescription: string };

interface CreateOrderProps {
  onStatusMessage: (message: string) => void;
  onOrderCreated: () => void;
}

export default function CreateOrder({
  onStatusMessage,
  onOrderCreated,
}: CreateOrderProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newOrder, setNewOrder] = useState({
    countryCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressName: "",
    addressType: "HOME",
    addressLine1: "",
    addressLine2: "",
  });

  const [newLines, setNewLines] = useState<NewLine[]>([
    { itemNum: "", itemDescription: "" },
  ]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleNewOrderField(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleNewLineChange(
    index: number,
    field: keyof NewLine,
    value: string
  ) {
    const copy = [...newLines];
    copy[index] = { ...copy[index], [field]: value };
    setNewLines(copy);
  }

  function addNewLineRow() {
    setNewLines((prev) => [...prev, { itemNum: "", itemDescription: "" }]);
  }

  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateNewOrder(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!newOrder.countryCode.trim()) {
      errors.countryCode = "Country Code is required";
    }

    if (!newOrder.firstName.trim()) {
      errors.firstName = "First Name is required";
    }

    if (!newOrder.lastName.trim()) {
      errors.lastName = "Last Name is required";
    }

    if (!newOrder.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(newOrder.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!newOrder.addressType.trim()) {
      errors.addressType = "Address Type is required";
    }

    if (!newOrder.addressLine1.trim()) {
      errors.addressLine1 = "Address Line 1 is required";
    }

    if (!newOrder.addressLine2.trim()) {
      errors.addressLine2 = "Address Line 2 is required";
    }

    return errors;
  }

  async function createOrder() {
    const errors = validateNewOrder();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      onStatusMessage("Please fix the validation errors");
      return;
    }

    try {
      const body = {
        countryCode: newOrder.countryCode,
        // referenceNum omitted so backend generates it
        customerCode: "", // backend will generate KM-xx if blank
        firstName: newOrder.firstName,
        lastName: newOrder.lastName,
        phone: newOrder.phone,
        email: newOrder.email,
        fullName: newOrder.addressName,
        addressType: newOrder.addressType,
        addressLine1: newOrder.addressLine1,
        addressLine2: newOrder.addressLine2,
        orderLines: newLines.filter(
          (l) => l.itemNum.trim() !== "" || l.itemDescription.trim() !== ""
        ),
      };

      await api.post("/api/orders", body);
      onStatusMessage("Order created successfully.");

      // reset form
      setNewOrder({
        countryCode: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        addressName: "",
        addressType: "HOME",
        addressLine1: "",
        addressLine2: "",
      });
      setNewLines([{ itemNum: "", itemDescription: "" }]);
      setFieldErrors({});
      setIsFormVisible(false); // Hide form after successful creation

      onOrderCreated();
    } catch (err) {
      console.error(err);
      onStatusMessage("Failed to create order.");
    }
  }

  const getInputStyle = (fieldName: string) =>
    fieldErrors[fieldName] ? errorInputStyle : inputStyle;

  return (
    <section style={cardSectionStyle}>
      <h2 style={sectionTitle}>Create New Order</h2>

      {!isFormVisible ? (
        <button
          onClick={() => setIsFormVisible(true)}
          style={primaryButtonStyle}
        >
          Create Order
        </button>
      ) : (
        <>
          <div style={twoColGrid}>
            <div>
              <input
                name="countryCode"
                placeholder="Country Code *"
                value={newOrder.countryCode}
                onChange={handleNewOrderField}
                style={getInputStyle("countryCode")}
              />
              {fieldErrors.countryCode && (
                <div style={errorTextStyle}>{fieldErrors.countryCode}</div>
              )}
            </div>

            <div>
              <input
                name="email"
                placeholder="Email *"
                type="email"
                value={newOrder.email}
                onChange={handleNewOrderField}
                style={getInputStyle("email")}
              />
              {fieldErrors.email && (
                <div style={errorTextStyle}>{fieldErrors.email}</div>
              )}
            </div>

            <div>
              <input
                name="firstName"
                placeholder="First Name *"
                value={newOrder.firstName}
                onChange={handleNewOrderField}
                style={getInputStyle("firstName")}
              />
              {fieldErrors.firstName && (
                <div style={errorTextStyle}>{fieldErrors.firstName}</div>
              )}
            </div>

            <div>
              <input
                name="lastName"
                placeholder="Last Name *"
                value={newOrder.lastName}
                onChange={handleNewOrderField}
                style={getInputStyle("lastName")}
              />
              {fieldErrors.lastName && (
                <div style={errorTextStyle}>{fieldErrors.lastName}</div>
              )}
            </div>

            <div>
              <input
                name="phone"
                placeholder="Phone"
                value={newOrder.phone}
                onChange={handleNewOrderField}
                style={inputStyle}
              />
            </div>

            <div>
              <input
                name="addressName"
                placeholder="Address Name"
                value={newOrder.addressName}
                onChange={handleNewOrderField}
                style={inputStyle}
              />
            </div>

            <div>
              <select
                name="addressType"
                value={newOrder.addressType}
                onChange={handleNewOrderField}
                style={getInputStyle("addressType")}
              >
                <option value="HOME">Home</option>
                <option value="PRIVATE">Private</option>
                <option value="WORK">Work</option>
                <option value="BILLING">Billing</option>
                <option value="SHIPPING">Shipping</option>
                <option value="OTHER">Other</option>
              </select>
              {fieldErrors.addressType && (
                <div style={errorTextStyle}>{fieldErrors.addressType}</div>
              )}
            </div>

            <div>
              <input
                name="addressLine1"
                placeholder="Address Line 1 *"
                value={newOrder.addressLine1}
                onChange={handleNewOrderField}
                style={getInputStyle("addressLine1")}
              />
              {fieldErrors.addressLine1 && (
                <div style={errorTextStyle}>{fieldErrors.addressLine1}</div>
              )}
            </div>

            <div>
              <input
                name="addressLine2"
                placeholder="Address Line 2 *"
                value={newOrder.addressLine2}
                onChange={handleNewOrderField}
                style={getInputStyle("addressLine2")}
              />
              {fieldErrors.addressLine2 && (
                <div style={errorTextStyle}>{fieldErrors.addressLine2}</div>
              )}
            </div>
          </div>

          {/* Line items for create */}
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

            {newLines.map((line, idx) => (
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
                    handleNewLineChange(idx, "itemNum", e.target.value)
                  }
                  style={inputStyle}
                />
                <input
                  placeholder="Item Description"
                  value={line.itemDescription}
                  onChange={(e) =>
                    handleNewLineChange(idx, "itemDescription", e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
            ))}

            <button onClick={addNewLineRow} style={secondaryButtonStyle}>
              + Add Line
            </button>
          </div>

          <button
            onClick={createOrder}
            style={{
              ...primaryButtonStyle,
              width: "100%",
              marginTop: "1rem",
            }}
          >
            Create Order
          </button>
        </>
      )}
    </section>
  );
}
