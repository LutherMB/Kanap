fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
          return res.json();
        }
    })
    .then(function(value) {
        // Affichage dynamique de chaque produit existant
        let content = "";
        let items = document.getElementById('items');
        for (let i = 0; i < value.length; i++) {
            // https://stackoverflow.com/questions/9250545/javascript-domparser-access-innerhtml-and-other-properties
            content += `<a href="./product.html?_id=${value[i]._id}">
            <article>
              <img src="${value[i].imageUrl}" alt="${value[i].altTxt}">
              <h3 class="productName">${value[i].name}</h3>
              <p class="productDescription">${value[i].description}</p>
            </article>
          </a>`;
        }
        let parser = new DOMParser();
        items.innerHTML = parser.parseFromString(content, "text/html").body.innerHTML;
    })
    .catch(function(err) {
        // Une erreur est survenue
    });