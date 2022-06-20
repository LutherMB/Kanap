const orderHTML = document.getElementById("orderId");
const orderId = localStorage.orderID;

orderHTML.innerHTML = orderId;
localStorage.clear();