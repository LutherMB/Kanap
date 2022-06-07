let totalPrice = 0;
let totalQty = 0;
let findedPrice;

async function findPrice (id) {
  // let returnValue;
  // let data =
  let response = await fetch("http://localhost:3000/api/products/" + id)
  let data = await response.json()
  return data.price
    // .then(function(res) {
    //     if (res.ok) {
    //       return res.json()
    //     }
    // }).then((data) => {
    //   findedPrice = data.price;
    //   console.log("Finded price : " + findedPrice);
    //   return data.price;
    // })
    // .then(value => findedPrice = value.price
      // function(value) {
      // returnValue = value.price;
      // console.log(value.price);
      // return value.price;
    // )
    // .catch(function(err) {
          // Une erreur est survenue
    // });
  // console.log(data);
  // return(data)
};

for (i = 0; i < localStorage.length; i++) {
    // On récupère les infos via le local Storage
    let article = localStorage.getItem(localStorage.key(i));
    let articleJSON = JSON.parse(article);
    let articleID = articleJSON.objectID;
    prix = findPrice(articleID);
    // let prix = findPrice(articleID).then(response => console.log(response));

    // fetch("http://localhost:3000/api/products/" + articleID)
    // .then(function(res) {
    //     if (res.ok) {
    //       console.log(res);
    //       return res.json();
    //     }
    // })
    // .then(function(value) {
        // Affichage dynamique de chaque article du panier
        let cartItems = document.getElementById('cart__items');
        cartItems.innerHTML += `<article class="cart__item" data-id="${articleJSON.objectID}" data-color="${articleJSON.objectColor}" data-name="${articleJSON.objectName}">
        <div class="cart__item__img">
          <img src="${articleJSON.objectUrl}" alt="${articleJSON.objectAlt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${articleJSON.objectName}</h2>
            <p>${articleJSON.objectColor}</p>
            <p id="${articleJSON.objectID}__price">${prix},00 €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input onchange="checkQuantity(this)" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${articleJSON.objectQty}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p onclick="deleteObj(this)" class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;

      // Ajustement du prix Total
      // totalPrice += value.price * articleJSON.objectQty;
      // document.getElementById('totalPrice').innerText = totalPrice.toFixed(2);
      // // Ajustement de la quantité Totale
      // totalQty += articleJSON.objectQty;
      // document.getElementById('totalQuantity').innerText = totalQty;
    // })
    // .catch(function(err) {
    //     // Une erreur est survenue
    // });
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
    // objPrice = findPrice(checkedObj.objectID);
    // console.log(objPrice);
  }

  console.log(elt.value);
};

function deleteObj (elt) {
  var parent = elt.parentElement.closest('article');
  localStorage.removeItem(parent.getAttribute('data-name') + "-" + parent.getAttribute('data-color'));

  parent.remove();
};
