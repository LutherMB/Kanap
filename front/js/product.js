// On récupère l'url actuelle, puis on récupère le contenu du paramètre "_id"
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
        img.innerHTML += `<img id="item__image" src="${value.imageUrl}" alt="${value.altTxt}">`
        
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

// Ajout au panier
document.getElementById("addToCart").addEventListener('click', function() {
    console.log("click");

    // Vérification couleur & nombre d'articles
    if (document.getElementById('colors').value == "") {
        console.log("Pas de couleur sélectionnée !");
        return;
    } else if (document.getElementById('quantity').value == 0) {
        console.log("0 article sélectionné !");
        return;
    };

    let obj = {
        objectID : id,
        objectQty : Number(document.getElementById('quantity').value),
        objectColor : document.getElementById('colors').value,
        objectName : document.getElementById('title').textContent,
        objectUrl : document.getElementById('item__image').src,
        objectAlt : document.getElementById('item__image').alt,
        objectDesc : document.getElementById('description').textContent
    };

    // Vérif si l'objet-couleur existe déjà
    for (i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) == obj.objectName + "-" + obj.objectColor) {
            console.log("Trouvé!");

            // L'objet trouvé dans le panier est parsé en JSON pour voir la Qté
            let findObj = localStorage.getItem(localStorage.key(i));
            let findObjJson = JSON.parse(findObj);
            console.log(`Qté de base : ${findObjJson.objectQty}`);

            // Addition de la qté actuelle à la qté présente dans le panier
            findObjJson.objectQty = Number(findObjJson.objectQty) + Number(obj.objectQty);
            // L'objet est renvoyé au local Storage avec sa nouvelle Qté
            let newObj = JSON.stringify(findObjJson);
            localStorage.setItem(localStorage.key(i), newObj);
            console.log(`New qté : ${findObjJson.objectQty}`);
            return;
        } else {
            console.log("Pas dans le panier..");
        }
    }
    // L'objet n'est pas déjà présent dans le panier, ajout d'un nouvel obj au local Storage
    let objString = JSON.stringify(obj);
    localStorage.setItem(`${obj.objectName}-${obj.objectColor}`, objString);

});