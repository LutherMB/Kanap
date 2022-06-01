let totalPrice = 0;
let totalQty = 0;

for (i = 0; i < localStorage.length; i++) {
    // On récupère les infos via le local Storage
    let article = localStorage.getItem(localStorage.key(i));
    let articleJSON = JSON.parse(article);
    let articleID = articleJSON.objectID;

    fetch("http://localhost:3000/api/products/" + articleID)
    .then(function(res) {
        if (res.ok) {
          return res.json();
        }
    })
    .then(function(value) {
        // Affichage dynamique de chaque article du panier
        let cartItems = document.getElementById('cart__items');
        cartItems.innerHTML += `<article class="cart__item" data-id="${articleJSON.objectID}" data-color="${articleJSON.objectColor}">
        <div class="cart__item__img">
          <img src="${value.imageUrl}" alt="${value.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${value.name}</h2>
            <p>${articleJSON.objectColor}</p>
            <p>${value.price},00 €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${articleJSON.objectQty}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`

      // Ajustement du prix Total
      totalPrice += value.price;
      document.getElementById('totalPrice').innerText = totalPrice.toFixed(2);
      // Ajustement de la quantité Totale
      totalQty += articleJSON.objectQty;
      document.getElementById('totalQuantity').innerText = totalQty;
    })
    .catch(function(err) {
        // Une erreur est survenue
    });
}

