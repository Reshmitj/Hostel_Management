import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar"; // ✅ Import Sidebar component
import { getInvoices } from "../api";

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getInvoices(token);
        if (Array.isArray(data)) {
          setInvoices(data);
        } else {
          console.error("Unexpected response:", data);
          setInvoices([]);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [token]);

  return (
    <div className="admin-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <h2 className="admin-header">💰 Billing Invoices</h2>
        <p className="admin-subtext">View and manage student billing invoices.</p>

        <div className="table-container">
          {loading ? (
            <p>Loading invoices...</p>
          ) : invoices.length > 0 ? (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.student.username}</td>
                    <td>${invoice.amount}</td>
                    <td>{new Date(invoice.created_on).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No invoices available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
