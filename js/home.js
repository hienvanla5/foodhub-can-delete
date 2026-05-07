import { foods } from "./foods.js";
import { setSelectedFood } from "./storage.js";
import { toast } from "./toast.js";

const container = document.getElementById("foodsContainer");

function createCard(food) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <div class="thumb"><img src="${food.image}" alt="${food.name}"/></div>
    <h3>${food.name}</h3>
    <div class="meta">
      <div class="price">$${food.price.toFixed(2)}</div>
      <button class="btn order-btn" data-id="${food.id}">Order</button>
    </div>
  `;
  return el;
}

function render() {
  container.innerHTML = "";
  foods.forEach((f) => container.appendChild(createCard(f)));
}

container.addEventListener("click", (e) => {
  const btn = e.target.closest(".order-btn");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const food = foods.find((x) => x.id === id);
  if (!food) return toast.error("Selected item not found");
  setSelectedFood(food);
  toast.success(`${food.name} selected`);
  setTimeout(() => {
    window.location.href = "order.html";
  }, 500);
});

render();
