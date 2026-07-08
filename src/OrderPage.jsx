import React, { useState } from "react";

/**
 * ── RESKIN THIS PER CLIENT ──────────────────────────────────────────
 * Everything vendor-specific lives here: identity, contact, full catalog.
 */
const BUSINESS = {
  name: "Switmumi Bakery",
  tagline: "Baked with love",
  whatsappNumber: "2349120216889",
  accent: "#8A4B26",
  paper: "#F6EFE4",
  ink: "#241C15",
  categories: [
    {
      name: "Cakes",
      items: [
        {
          name: "1 Layer Cake",
          sizes: [
            { label: '5"', price: 15500 },
            { label: '6"', price: 25000 },
            { label: '7"', price: 30000 },
            { label: '8"', price: 35500 },
            { label: '9"', price: 40000 },
          ],
        },
        {
          name: "2 Layer Cake",
          sizes: [
            { label: '5"', price: 40000 },
            { label: '6"', price: 45000 },
            { label: '7"', price: 50000 },
            { label: '8"', price: 65000 },
            { label: '9"', price: 70000 },
          ],
        },
        {
          name: "3 Layer Cake",
          sizes: [
            { label: '5"', price: 73500 },
            { label: '6"', price: 75000 },
            { label: '7"', price: 80000 },
            { label: '8"', price: 85000 },
            { label: '9"', price: 110000 },
          ],
        },
      ],
    },
    {
      name: "Cakes & Pastries",
      items: [
        { name: "Cake Slice", price: 7000 },
        { name: "Banana Bread", price: 8000 },
        { name: "Meat Pie", price: 2000 },
        { name: "Chicken Pie", price: 2000 },
      ],
    },
    {
      name: "Doughnuts",
      items: [
        { name: "Single Doughnut", price: 1000 },
        { name: "Milky Doughnuts (3pcs)", price: 7000 },
        { name: "Plain Doughnuts (3pcs)", price: 4000 },
      ],
    },
    {
      name: "Bread",
      items: [
        { name: "Milky Bread", price: 2000 },
        { name: "Small Milky Bread", price: 800 },
        { name: "Chocolate Bread", price: 2000 },
        { name: "Cheesesteak Bread", price: 35000 },
        { name: "Round Bread (4pcs)", price: 3000 },
      ],
    },
    {
      name: "Drinks",
      items: [
        { name: "Zobo", price: 2000 },
        { name: "Tigernut", price: 2000 },
      ],
    },
  ],
};

const formatNaira = (n) => `₦${n.toLocaleString("en-NG")}`;

function ItemCard({ item, onAdd }) {
  const [size, setSize] = useState(item.sizes ? item.sizes[0].label : null);
  const [qtyInput, setQtyInput] = useState("1");

  const qty = Math.max(1, parseInt(qtyInput, 10) || 1);

  const unitPrice = item.sizes
    ? item.sizes.find((s) => s.label === size).price
    : item.price;

  return (
    <div
      style={{
        border: "1.5px solid #E5DAC6",
        borderRadius: 10,
        padding: "14px 14px",
        background: "#FFFDF9",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>

      {item.sizes ? (
        <select
          className="op-input"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          {item.sizes.map((s) => (
            <option key={s.label} value={s.label}>
              {s.label} — {formatNaira(s.price)}
            </option>
          ))}
        </select>
      ) : (
        <div style={{ fontSize: 13, color: "#8A7B65", fontWeight: 500 }}>
          {formatNaira(item.price)}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="number"
          min={1}
          value={qtyInput}
          onChange={(e) => setQtyInput(e.target.value)}
          onBlur={() => setQtyInput(String(qty))}
          className="op-input"
          style={{ width: 64 }}
        />
        <button
          type="button"
          onClick={() => {
            onAdd({
              id: `${Date.now()}-${Math.random()}`,
              name: item.name,
              size,
              unitPrice,
              quantity: qty,
            });
            setQtyInput("1");
          }}
          style={{
            flex: 1,
            border: "none",
            borderRadius: 6,
            background: BUSINESS.ink,
            color: BUSINESS.paper,
            fontWeight: 600,
            fontSize: 13,
            padding: "9px 0",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

const initialCustomer = {
  name: "",
  phone: "",
  date: "",
  fulfilment: "Pickup",
  address: "",
  notes: "",
};

function buildMessage(cart, customer, total) {
  const lines = [`Hello ${BUSINESS.name}, I'd like to place an order:`, ``];

  cart.forEach((line) => {
    const label = line.size ? `${line.name} (${line.size})` : line.name;
    lines.push(
      `${label} x${line.quantity} - ${formatNaira(line.unitPrice * line.quantity)}`
    );
  });

  lines.push(``, `Total: ${formatNaira(total)}`, ``);
  lines.push(`Delivery date: ${customer.date || "—"}`);
  lines.push(
    `${customer.fulfilment}${
      customer.fulfilment === "Delivery" ? `: ${customer.address || "—"}` : ""
    }`
  );
  lines.push(``, `Name: ${customer.name || "—"}`, `Phone: ${customer.phone || "—"}`);
  if (customer.notes) lines.push(``, `Notes: ${customer.notes}`);

  return lines.join("\n");
}

export default function OrderPage() {
  const [activeCategory, setActiveCategory] = useState(BUSINESS.categories[0].name);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(initialCustomer);
  const [sent, setSent] = useState(false);

  const update = (key) => (e) =>
    setCustomer((prev) => ({ ...prev, [key]: e.target.value }));

  const addToCart = (line) => setCart((prev) => [...prev, line]);
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((l) => l.id !== id));

  const total = cart.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  const canSubmit =
    cart.length > 0 && customer.name && customer.phone && customer.date;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const message = buildMessage(cart, customer, total);
    const url = `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
    setSent(true);
  };

  const activeItems = BUSINESS.categories.find(
    (c) => c.name === activeCategory
  ).items;

  return (
    <div
      className="op-page-padding"
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#EDE6D8",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        color: BUSINESS.ink,
        padding: "32px 16px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .op-input {
          width: 100%;
          box-sizing: border-box;
          padding: 9px 10px;
          border: 1.5px solid #D8CBB5;
          border-radius: 6px;
          background: #FFFDF9;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: ${BUSINESS.ink};
          outline: none;
        }
        .op-input:focus { border-color: ${BUSINESS.accent}; }
        .op-label {
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #8A7B65;
          margin-bottom: 6px;
          display: block;
        }
        .op-field { margin-bottom: 14px; }
        .cat-tab {
          padding: 8px 14px;
          border-radius: 20px;
          border: 1.5px solid #D8CBB5;
          background: #FFFDF9;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .cat-tab.active {
          background: ${BUSINESS.ink};
          border-color: ${BUSINESS.ink};
          color: ${BUSINESS.paper};
        }
        .item-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .op-toggle-btn {
          flex: 1;
          padding: 9px 0;
          border-radius: 6px;
          border: 1.5px solid #D8CBB5;
          background: #FFFDF9;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          color: ${BUSINESS.ink};
        }
        .op-toggle-btn.active {
          background: ${BUSINESS.ink};
          border-color: ${BUSINESS.ink};
          color: ${BUSINESS.paper};
        }
        .cart-row {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 12.5px;
          padding: 6px 0;
          border-bottom: 1px dashed #D8CBB5;
        }
        @media (max-width: 760px) {
          .op-grid { grid-template-columns: 1fr !important; }
          .item-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 420px) {
          .op-page-padding { padding: 20px 10px !important; }
          .op-card-padding { padding: 20px 16px !important; }
        }
      `}</style>

      <div
        className="op-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: 24,
          maxWidth: 980,
          width: "100%",
          margin: "0 auto",
          minWidth: 0,
          alignItems: "start",
        }}
      >
        {/* ── CATALOG ── */}
        <div
          className="op-card-padding"
          style={{
            background: "#FFFDF9",
            borderRadius: 14,
            padding: "28px 24px",
            minWidth: 0,
            boxSizing: "border-box",
            boxShadow: "0 1px 3px rgba(36,28,21,0.06), 0 12px 32px rgba(36,28,21,0.06)",
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700 }}>
              {BUSINESS.name}
            </div>
            <div style={{ fontSize: 13.5, color: "#8A7B65", marginTop: 2 }}>
              {BUSINESS.tagline}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 4, minWidth: 0 }}>
            {BUSINESS.categories.map((c) => (
              <button
                key={c.name}
                type="button"
                className={`cat-tab ${activeCategory === c.name ? "active" : ""}`}
                onClick={() => setActiveCategory(c.name)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="item-grid">
            {activeItems.map((item) => (
              <ItemCard key={item.name} item={item} onAdd={addToCart} />
            ))}
          </div>
        </div>

        {/* ── ORDER SUMMARY + CUSTOMER DETAILS ── */}
        <div
          className="op-card-padding"
          style={{
            background: BUSINESS.paper,
            borderRadius: 14,
            padding: "24px 22px",
            minWidth: 0,
            boxSizing: "border-box",
            boxShadow: "0 1px 2px rgba(36,28,21,0.08), 0 10px 24px rgba(36,28,21,0.08)",
          }}
        >
          {sent ? (
            <div style={{ textAlign: "center", padding: "30px 8px" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                Order sent to WhatsApp
              </div>
              <div style={{ fontSize: 13, color: "#8A7B65", marginBottom: 16 }}>
                {BUSINESS.name} will confirm shortly.
              </div>
              <button
                onClick={() => {
                  setCart([]);
                  setCustomer(initialCustomer);
                  setSent(false);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  color: BUSINESS.accent,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Start a new order
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
                Your order
              </div>

              {cart.length === 0 ? (
                <div style={{ fontSize: 13, color: "#8A7B65", marginBottom: 16 }}>
                  Nothing added yet — pick items from the menu.
                </div>
              ) : (
                <div style={{ marginBottom: 12 }}>
                  {cart.map((line) => (
                    <div className="cart-row" key={line.id}>
                      <span>
                        {line.name}
                        {line.size ? ` (${line.size})` : ""} x{line.quantity}
                      </span>
                      <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontWeight: 600 }}>
                          {formatNaira(line.unitPrice * line.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(line.id)}
                          style={{
                            border: "none",
                            background: "none",
                            color: "#B5484D",
                            cursor: "pointer",
                            fontSize: 13,
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: 10,
                      fontWeight: 700,
                      fontSize: 14.5,
                    }}
                  >
                    <span>Total</span>
                    <span>{formatNaira(total)}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="op-field">
                  <label className="op-label">Full name</label>
                  <input className="op-input" value={customer.name} onChange={update("name")} placeholder="John Doe" required />
                </div>
                <div className="op-field">
                  <label className="op-label">Phone number</label>
                  <input className="op-input" value={customer.phone} onChange={update("phone")} placeholder="080..." required />
                </div>
                <div className="op-field">
                  <label className="op-label">Delivery date</label>
                  <input className="op-input" type="date" value={customer.date} onChange={update("date")} required />
                </div>
                <div className="op-field">
                  <label className="op-label">Pickup or delivery</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Pickup", "Delivery"].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        className={`op-toggle-btn ${customer.fulfilment === opt ? "active" : ""}`}
                        onClick={() => setCustomer((p) => ({ ...p, fulfilment: opt }))}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                {customer.fulfilment === "Delivery" && (
                  <div className="op-field">
                    <label className="op-label">Delivery address</label>
                    <input className="op-input" value={customer.address} onChange={update("address")} placeholder="Street, area, city" />
                  </div>
                )}
                <div className="op-field">
                  <label className="op-label">Notes (optional)</label>
                  <input className="op-input" value={customer.notes} onChange={update("notes")} placeholder="Happy birthday message, etc." />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  style={{
                    width: "100%",
                    marginTop: 6,
                    padding: "13px 0",
                    border: "none",
                    borderRadius: 8,
                    background: canSubmit ? BUSINESS.accent : "#D8CBB5",
                    color: "#FFF9F2",
                    fontWeight: 700,
                    fontSize: 14.5,
                    cursor: canSubmit ? "pointer" : "not-allowed",
                  }}
                >
                  Place order on WhatsApp →
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
