import { useState } from "react";
import type { Order } from "../types";
import {
  cardSectionStyle,
  sectionTitle,
  secondaryButtonStyle,
  tableHeadRowStyle,
  thCell,
  tdCell,
  minorText,
  miniButtonDark,
  miniButtonDanger,
} from "../styles.js";

interface OrdersTableProps {
  orders: Order[];
  onRefresh: () => void;
  onEdit: (order: Order) => void;
  onDeleteRequest: (order: Order) => void;
}

export default function OrdersTable({
  orders,
  onRefresh,
  onEdit,
  onDeleteRequest,
}: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  // Reset to first page when orders change
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <section style={cardSectionStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: ".5rem",
        }}
      >
        <h2 style={sectionTitle}>Orders</h2>
        <button onClick={onRefresh} style={secondaryButtonStyle}>
          Refresh
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: ".8rem",
          }}
        >
          <thead>
            <tr style={tableHeadRowStyle}>
              <th style={thCell}>ID</th>
              <th style={thCell}>Ref #</th>
              <th style={thCell}>Country</th>
              <th style={thCell}>Customer</th>
              <th style={thCell}>Address</th>
              <th style={thCell}>Lines</th>
              <th style={thCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  style={{
                    padding: ".5rem",
                    fontStyle: "italic",
                    color: "#666",
                  }}
                  colSpan={7}
                >
                  No orders yet.
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <tr
                  key={order.orderId}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <td style={tdCell}>{order.orderId}</td>
                  <td style={tdCell}>{order.referenceNum}</td>
                  <td style={tdCell}>{order.countryCode}</td>
                  <td style={tdCell}>
                    {order.customer?.firstName} {order.customer?.lastName}
                    <br />
                    <span style={minorText}>
                      {order.customer?.customerCode}
                    </span>
                    <br />
                    <span style={minorText}>{order.customer?.email}</span>
                    {order.customer?.phone && (
                      <>
                        <br />
                        <span style={minorText}>{order.customer?.phone}</span>
                      </>
                    )}
                  </td>
                  <td style={tdCell}>
                    {order.address?.fullName}
                    <br />
                    <span style={minorText}>{order.address?.addressType}</span>
                    <br />
                    <span style={minorText}>
                      {order.address?.addressLine1}
                      {order.address?.addressLine2 && (
                        <>
                          <br />
                          {order.address?.addressLine2}
                        </>
                      )}
                    </span>
                  </td>
                  <td style={tdCell}>
                    {order.orderLines && order.orderLines.length > 0 ? (
                      order.orderLines.map((line, i) => (
                        <div key={i}>
                          {line.itemNum} — {line.itemDescription}
                        </div>
                      ))
                    ) : (
                      <span style={minorText}>None</span>
                    )}
                  </td>
                  <td style={tdCell}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.25rem",
                        flexWrap: "nowrap",
                      }}
                    >
                      <button
                        onClick={() => onEdit(order)}
                        style={miniButtonDark}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteRequest(order)}
                        style={miniButtonDanger}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            padding: "0.5rem 0",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#666" }}>
            Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of{" "}
            {orders.length} orders
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              style={{
                ...secondaryButtonStyle,
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Previous
            </button>

            <div style={{ display: "flex", gap: "0.25rem" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{
                      ...secondaryButtonStyle,
                      backgroundColor: page === currentPage ? "#222" : "#eee",
                      color: page === currentPage ? "white" : "#222",
                      minWidth: "2rem",
                      padding: "0.25rem 0.5rem",
                      fontSize: "0.75rem",
                    }}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              style={{
                ...secondaryButtonStyle,
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
