console.log("Wsh");
fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
          return res.json();
        }
    })
    .then(function(value) {
        console.log(value[0].name);
        for (i = 0; i < value.length; i++) {
            let items = document.getElementById('items');
            items.innerHTML += `<a href="">
            <article>
              <img src="${value[i].imageUrl}" alt="${value[i].altTxt}">
              <h3 class="productName">${value[i].name}</h3>
              <p class="productDescription">${value[i].description}</p>
            </article>
          </a>`
        }
    })
    .catch(function(err) {
        // Une erreur est survenue
    });
// console.log(document.getElementsByClassName('titles'));