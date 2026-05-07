export function setSelectedFood(food) {
  try {
    localStorage.setItem("selectedFood", JSON.stringify(food));
  } catch (e) {
    console.error(e);
  }
}
export function getSelectedFood() {
  try {
    const f = localStorage.getItem("selectedFood");
    return f ? JSON.parse(f) : null;
  } catch (e) {
    return null;
  }
}
