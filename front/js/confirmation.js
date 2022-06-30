// Récupère le numéro de commande dans le Local Storage
const orderHTML = document.getElementById("orderId");
const orderId = localStorage.orderID;

// Affiche le numéro de commande avant de vider le Local Storage
orderHTML.textContent = orderId;
localStorage.clear();