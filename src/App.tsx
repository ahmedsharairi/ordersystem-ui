// src/App.tsx
import { useEffect, useState } from "react";
import "./App.css";
import api from "./api";
import type { Order } from "./types";
import XmlImport from "./components/XmlImport";
import CreateOrder from "./components/CreateOrder";
import OrdersTable from "./components/OrdersTable";
import EditOrder from "./components/EditOrder";
import DeleteConfirmation from "./components/DeleteConfirmation";

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // load all orders
  async function loadOrders() {
    try {
      const res = await api.get<Order[]>("/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function handleStatusMessage(message: string) {
    // Status messages are no longer displayed
    console.log(message);
  }

  function handleImportSuccess() {
    loadOrders();
  }

  function handleOrderCreated() {
    loadOrders();
  }

  function handleOrderUpdated() {
    loadOrders();
  }

  function handleEditOrder(order: Order) {
    setSelectedOrderId(order.orderId);
    setSelectedOrder(order);
  }

  function handleEditComplete() {
    setSelectedOrderId(null);
    setSelectedOrder(null);
  }

  function handleDeleteRequest(order: Order) {
    setOrderToDelete(order);
    // Clear any selected order for editing
    setSelectedOrderId(null);
    setSelectedOrder(null);
  }

  async function handleDeleteConfirm() {
    if (orderToDelete) {
      try {
        await api.delete(`/api/orders/${orderToDelete.orderId}`);
        await loadOrders();
        setOrderToDelete(null);
      } catch (err) {
        console.error(err);
      }
    }
  }

  function handleDeleteCancel() {
    setOrderToDelete(null);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        color: "#222",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          padding: "3rem 2rem 2rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          boxSizing: "border-box",
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            margin: "0 0 1rem 0",
            fontSize: "2rem",
            fontWeight: 600,
            textAlign: "center",
            color: "#222",
          }}
        >
          Order System Management
        </h1>

        {/* MAIN CONTENT */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "center",
          }}
        >
          {/* LEFT COLUMN */}
          <div
            style={{
              flex: "1 1 650px",
              minWidth: "300px",
              maxWidth: "750px",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <XmlImport
              onStatusMessage={handleStatusMessage}
              onImportSuccess={handleImportSuccess}
            />

            <CreateOrder
              onStatusMessage={handleStatusMessage}
              onOrderCreated={handleOrderCreated}
            />

            <OrdersTable
              orders={orders}
              onRefresh={loadOrders}
              onEdit={handleEditOrder}
              onDeleteRequest={handleDeleteRequest}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div
            style={{
              flex: "1 1 300px",
              minWidth: "260px",
              maxWidth: "360px",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {orderToDelete ? (
              <DeleteConfirmation
                order={orderToDelete}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
              />
            ) : (
              <EditOrder
                selectedOrderId={selectedOrderId}
                selectedOrder={selectedOrder}
                onStatusMessage={handleStatusMessage}
                onOrderUpdated={handleOrderUpdated}
                onEditComplete={handleEditComplete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
