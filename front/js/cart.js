let totalPrice = 0;
let totalQty = 0;
let foundPrice = 0;
let priceProduct = [];
let quantityProduct = [];

const totalPriceHTML = document.getElementById("totalPrice");

function buildCartArticle(articleJSON, price) {
    console.log(articleJSON);
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

for (i = 0; i < localStorage.length; i++) {
    // On récupère les infos via le local Storage
    let article = localStorage.getItem(localStorage.key(i));
    let articleJSON = JSON.parse(article);
    let price = fetch("http://localhost:3000/api/products/" + articleJSON.objectID)
        .then((result) => result.json())
        .then((data) => {
            foundPrice = data.price;
            console.log("found price : " + foundPrice);
            let cartItems = document.getElementById('cart__items');
            articleJSON.temporaryPrice = data.price;
            cartItems.innerHTML += buildCartArticle(articleJSON);

            totalQty += articleJSON.objectQty;
            document.getElementById('totalQuantity').innerText = totalQty;
            checkQuantity(document.getElementById(articleJSON.objectID + "__qty"));
            checkTotalPrice();
        });

}

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

  // Ajustement de la quantité et du prix total
  if (checkedObj.objectQty > oldQty) {
    totalQty += checkedObj.objectQty - oldQty;
    document.getElementById('totalQuantity').innerText = totalQty;
  } else if (checkedObj.objectQty < oldQty) {
    totalQty -= oldQty - checkedObj.objectQty;
    document.getElementById('totalQuantity').innerText = totalQty;
  }

  console.log(elt.value);

  checkTotalPrice();
};

function deleteObj (elt) {
  let parent = elt.parentElement.closest('article');
  let deletedKey = parent.getAttribute('data-name') + "-" + parent.getAttribute('data-color');
  let deletedObj = JSON.parse(localStorage[deletedKey]);
  // Ajustement de la Qté
  totalQty -= deletedObj.objectQty;
  document.getElementById('totalQuantity').innerText = totalQty;
  // Suppression de l'obj LocalStorage et de l'article HTML
  localStorage.removeItem(deletedKey);
  parent.remove();
  checkTotalPrice()
};
