import { getSelectedFood } from "./storage.js";
import { toast } from "./toast.js";

const cardEl = document.getElementById("selectedFoodCard");
const summaryEl = document.getElementById("summaryContent");
const form = document.getElementById("orderForm");
const qtyInput = document.getElementById("quantity");
const fullnameEl = document.getElementById("fullname");
const phoneEl = document.getElementById("phone");
const addressEl = document.getElementById("address");
const paymentEls = form.querySelectorAll('input[name="payment"]');

function renderSelected(food) {
  cardEl.innerHTML = "";
  const thumb = document.createElement("div");
  thumb.className = "thumb";
  const img = document.createElement("img");
  img.src = food.image;
  img.alt = food.name;
  thumb.appendChild(img);
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `<h4>${food.name}</h4><div class="price">$${food.price.toFixed(2)}</div>`;
  cardEl.appendChild(thumb);
  cardEl.appendChild(meta);
}

function renderSummary(food, qty) {
  const total = food.price * qty;
  summaryEl.innerHTML = `
    <div><strong>${food.name}</strong></div>
    <div>Price: $${food.price.toFixed(2)}</div>
    <div>Quantity: ${qty}</div>
    <hr />
    <div><strong>Total: $${total.toFixed(2)}</strong></div>
  `;
}

function validate(values) {
  const { fullname, phone, address, quantity, payment } = values;
  if (!fullname || !fullname.trim()) return "Please enter your full name";
  if (!phone || !/^[0-9]{10,}$/.test(phone.replace(/\s+/g, "")))
    return "Invalid phone number";
  if (!address || !address.trim()) return "Address is required";
  if (!quantity || Number(quantity) < 1) return "Quantity must be at least 1";
  if (!["cash", "momo", "banking"].includes(payment))
    return "Select a payment method";
  return null;
}

function validateField(name, value) {
  if (name === "fullname") {
    if (!value || !value.trim()) return "Please enter your full name";
  }
  if (name === "phone") {
    if (!value || !/^[0-9]{10,}$/.test(value.replace(/\s+/g, "")))
      return "Invalid phone number";
  }
  if (name === "address") {
    if (!value || !value.trim()) return "Address is required";
  }
  if (name === "quantity") {
    if (!value || Number(value) < 1) return "Quantity must be at least 1";
  }
  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  const food = getSelectedFood();
  if (!food) {
    toast.error("No item selected");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 900);
    return;
  }
  renderSelected(food);
  renderSummary(food, Number(qtyInput.value || 1));

  // Per-field validation: show toast on blur/change
  if (fullnameEl) {
    fullnameEl.addEventListener("blur", () => {
      const err = validateField("fullname", fullnameEl.value);
      if (err) toast.error(err);
    });
  }
  if (phoneEl) {
    phoneEl.addEventListener("blur", () => {
      const err = validateField("phone", phoneEl.value);
      if (err) toast.error(err);
    });
    phoneEl.addEventListener("input", () => {
      // restrict to digits and spaces for UX
      phoneEl.value = phoneEl.value.replace(/[^0-9\s]/g, "");
    });
  }
  if (addressEl) {
    addressEl.addEventListener("blur", () => {
      const err = validateField("address", addressEl.value);
      if (err) toast.error(err);
    });
  }
  if (qtyInput) {
    qtyInput.addEventListener("blur", () => {
      const err = validateField("quantity", qtyInput.value);
      if (err) toast.error(err);
    });
  }

  paymentEls.forEach((el) => {
    el.addEventListener("change", () => {
      // optional: no toast unless needed
    });
  });

  qtyInput.addEventListener("input", () => {
    const q = Math.max(1, Number(qtyInput.value || 1));
    qtyInput.value = q;
    renderSummary(food, q);
  });

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const values = {
      fullname: formData.get("fullname"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      quantity: formData.get("quantity"),
      payment: formData.get("payment"),
      note: formData.get("note"),
    };
    const err = validate(values);
    if (err) {
      toast.error(err);
      // focus first invalid field by message
      if (err.toLowerCase().includes("name")) {
        fullnameEl && fullnameEl.focus();
      } else if (err.toLowerCase().includes("phone")) {
        phoneEl && phoneEl.focus();
      } else if (err.toLowerCase().includes("address")) {
        addressEl && addressEl.focus();
      } else if (err.toLowerCase().includes("quantity")) {
        qtyInput && qtyInput.focus();
      } else if (err.toLowerCase().includes("payment")) {
        const first = Array.from(paymentEls).find(Boolean);
        if (first) first.focus();
      }
      return;
    }

    // Simulate order success
    toast.success("Order placed successfully");
    try {
      localStorage.removeItem("selectedFood");
    } catch (e) {}
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  });
});
