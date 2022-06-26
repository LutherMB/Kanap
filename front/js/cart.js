let totalQty = 0;
let priceProduct = [];
let quantityProduct = [];

const totalPriceHTML = document.getElementById("totalPrice");

// Mise en place de la page panier
for (i = 0; i < localStorage.length; i++) {

  // On récupère l'objet via le local Storage
  let article = localStorage.getItem(localStorage.key(i));
  let articleJSON = JSON.parse(article);

  // Puis on récupère les infos via une requête à l'API
  let price = fetch("http://localhost:3000/api/products/" + articleJSON.objectID)
  .then((result) => result.json())
  .then((data) => {
    articleJSON.temporaryPrice = data.price; // Variable utilisée dans la fonction buildCartArticle()
    // Insertion de l'élément sur la page panier
    let cartItems = document.getElementById('cart__items');
    cartItems.innerHTML += buildCartArticle(articleJSON);
    // Mise à jour des qtés et prix totaux
    totalQty += articleJSON.objectQty;
    document.getElementById('totalQuantity').innerText = totalQty;
    checkQuantity(document.getElementById(articleJSON.objectID + "__qty"));
    checkTotalPrice();
  });
  
}

// Crée l'élément sur la page panier
function buildCartArticle(articleJSON, price) {
    return `<article class="cart__item" data-id="${articleJSON.objectID}" data-color="${articleJSON.objectColor}" data-name="${articleJSON.objectName}">
        <div class="cart__item__img">
          <img src="${articleJSON.objectUrl}" alt="${articleJSON.objectAlt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${articleJSON.objectName}</h2>
            <p>${articleJSON.objectColor}</p>
            <p id="${articleJSON.objectID}__price">${articleJSON.temporaryPrice},00 €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input onchange="checkQuantity(this)" type="number" id="${articleJSON.objectID}__qty" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${articleJSON.objectQty}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p onclick="deleteObj(this)" class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;
}

// Récupère les prix & qté de chaque article pour mettre à jour le prix total
function checkTotalPrice() {
  let articles = document.getElementsByClassName("itemQuantity");
  let tempTotalPrice = 0;
  [].forEach.call(articles, function (item) {
      let parent = item.parentElement.closest('article');
      let dataId = parent.getAttribute('data-id');
      let innerPrice = parseInt(document.getElementById(dataId + "__price").innerHTML.replace("€", ""));
      let qTy = item.value;
      let articlePrice = qTy * innerPrice;
      tempTotalPrice += articlePrice;
  });
  totalPriceHTML.innerHTML = tempTotalPrice;
}

// Mise à jour des qtés à chaque changement sur le panier
function checkQuantity (elt) {
  var parent = elt.parentElement.closest('article');

  // Récupération de l'élement dans le Local Storage
  var checkedName = parent.getAttribute('data-name');
  var checkedColor = parent.getAttribute('data-color');
  var checkedKey = checkedName + "-" + checkedColor;
  var checkedObj = JSON.parse(localStorage[checkedKey]);
  var oldQty = checkedObj.objectQty;

  // Modification de la quantité puis réinsertion dans le Local Storage
  checkedObj.objectQty = Number(elt.value);
  localStorage[checkedKey] = JSON.stringify(checkedObj);

  // Ajustement de la qté totale
  if (checkedObj.objectQty > oldQty) {
    totalQty += checkedObj.objectQty - oldQty;
    document.getElementById('totalQuantity').innerText = totalQty;
  } else if (checkedObj.objectQty < oldQty) {
    totalQty -= oldQty - checkedObj.objectQty;
    document.getElementById('totalQuantity').innerText = totalQty;
  }

  checkTotalPrice(); // Re-check du prix total
};

// Suppression de l'article du Local Storage & de la page panier
function deleteObj (elt) {
  // Récupération de l'article dans le Local Storage
  let parent = elt.parentElement.closest('article');
  let deletedKey = parent.getAttribute('data-name') + "-" + parent.getAttribute('data-color');
  let deletedObj = JSON.parse(localStorage[deletedKey]);
  // Ajustement de la Qté totale
  totalQty -= deletedObj.objectQty;
  document.getElementById('totalQuantity').innerText = totalQty;
  // Suppression de l'obj LocalStorage et de l'article HTML
  localStorage.removeItem(deletedKey);
  parent.remove();
  checkTotalPrice() // Re-check du prix total
};

// Mise en place des Regex

let form = document.querySelector(".cart__order__form");

const regexChar = /^[A-Za-zÀ-ÖØ-öø-ÿ ,.'-]+$/;
const regexAdress = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s,.'-]{3,}$/;
const regexEmail =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

form.firstName.addEventListener("input", (event) => { // Ecoute des changements sur l'input
  console.log(event.target.value);                    // event.target.value renvoie ce qui a été entré dans l'input
  checkFirstName(event.target.value);                 // Puis vérification via les Regex
});

form.lastName.addEventListener("input", (event) => {
  console.log(event.target.value);
  checkLastName(event.target.value);
});

form.address.addEventListener("input", (event) => {
  console.log(event.target.value);
  checkAddress(event.target.value);
});

form.city.addEventListener("input", (event) => {
  console.log(event.target.value);
  checkCity(event.target.value);
});

form.email.addEventListener("input", (event) => {
  console.log(event.target.value);
  checkEmail(event.target.value);
});

function checkFirstName(prenom) {
  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  if (regexChar.test(prenom)) { // Si l'entrée passe le test Regex, renvoie true et n'affiche rien
    firstNameErrorMsg.innerHTML = "";
    return true
  } else { // Si l'entrée ne passe pas le test Regex, renvoie false + affiche un message d'erreur
    firstNameErrorMsg.innerHTML = "Veuillez renseigner votre prénom !";
    return false
  }
}

function checkLastName(nom) {
  const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  if (regexChar.test(nom)) {
    lastNameErrorMsg.innerHTML = "";
    return true
  } else {
    lastNameErrorMsg.innerHTML = "Veuillez renseigner votre nom !";
    return false
  }
}

function checkAddress(adresse) {
  const addressErrorMsg = document.getElementById("addressErrorMsg");
  if (regexAdress.test(adresse)) {
    addressErrorMsg.innerHTML = "";
    return true
  } else {
    addressErrorMsg.innerHTML = "Veuillez renseigner votre adresse !";
    return false
  }
}

function checkCity(ville) {
  const cityErrorMsg = document.getElementById("cityErrorMsg");
  if (regexChar.test(ville)) {
    cityErrorMsg.innerHTML = "";
    return true
  } else {
    cityErrorMsg.innerHTML = "Veuillez renseigner votre ville !";
    return false
  }
}

function checkEmail(email) {
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  if (regexEmail.test(email)) {
    emailErrorMsg.innerHTML = "";
    return true
  } else {
    emailErrorMsg.innerHTML = "Veuillez renseigner votre adresse mail !";
    return false
  }
}

// Vérification du formulaire avant envoi au server
//? Event "click" car sur l'event "submit" la page redirect automatiquement & impossible de preventDefault

form.order.addEventListener("click", (event) => {
  event.preventDefault(); // Le clic n'envoie pas directement le formulaire au server
  // isFormCompleted renvoie true si chaque champ est correct (true), renvoie false si au moins un champ est mal rempli (false)
  isFormCompleted = checkFirstName(form.firstName.value) && checkLastName(form.lastName.value) && checkAddress(form.address.value) && checkCity(form.city.value) && checkEmail(form.email.value);

  if (isFormCompleted == false) {
    console.log("Tous les champs ne sont pas remplis");
    return;
  }

  if (emptyCart()) { // Vérifie si le panier est vide
    console.log("Panier vide!");
    return false;
  } else { // Envoie des données au server
    sendOrder();
  }
});

// Envoie des données au server
function sendOrder() { 
  // Récupère les infos du formulaire et les insère dans l'objet contact
  const prenom = document.getElementById("firstName").value;
  const nom = document.getElementById("lastName").value;
  const ville = document.getElementById("city").value;
  const adresse = document.getElementById("address").value;
  const mail = document.getElementById("email").value;

  let contact = {
    firstName: prenom,
    lastName: nom,
    city: ville,
    address: adresse,
    email: mail,
  };

  let products = [];

  for (i = 0; i < localStorage.length; i++) { // Récupère les IDs du LocalStorage et les push dans le tableau products
    let article = localStorage.getItem(localStorage.key(i));
    let articleJSON = JSON.parse(article);
    products.push(articleJSON.objectID);
  }

  let body = { // Mise en forme des données pour envoi au server
    'contact': contact,
    'products': products
  }

  // Requête POST pour envoyer les données au server et récupérer le numéro de commande ("orderId")
  let response = fetch("http://localhost:3000/api/products/order", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body),
  })
  .then(function(res) {
    if (res.ok) {
    return res.json();
    }
  })
  .then((data) => {
    console.log(data);
    localStorage.setItem("orderID", data.orderId) // OrderID placé temporairement dans le LocalStorage avant changement de page
    window.location.replace("./confirmation.html");
  })
  .catch(function(err) {
    console.log("erreur!");
  });
}

// Renvoie true si le panier est vide
function emptyCart() {
  return localStorage.length == 0
};