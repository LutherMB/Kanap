console.log("Yo!");

console.log("Récupération de l'id..");
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("_id");
console.log(id);

fetch(`http://localhost:3000/api/products/${id}`)
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(value) {
        console.log(value);
        // Insertion des infos dans le DOM
        let img = document.getElementsByClassName("item__img")[0];
        img.innerHTML += `<img src="${value.imageUrl}" alt="Photographie d'un canapé">`
        
        let title = document.getElementById("title");
        title.innerHTML += `${value.name}`
        
        let price = document.getElementById("price");
        price.innerHTML += `${value.price}`
        
        let desc = document.getElementById("description");
        desc.innerHTML += `${value.description}`
        
        let colors = document.getElementById("colors");
        for (i = 0; i < value.colors.length; i++) {
            colors.innerHTML += `<option value="${value.colors[i]}">${value.colors[i]}</option>`
        }
    })
    .catch(function(err) {
        // Une erreur est survenue
    });