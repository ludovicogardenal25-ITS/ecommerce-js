"use strict";

const productList = document.getElementById("product-list");

startApp();

// inizializza l'applicazione
async function startApp() {
    const db = await loadDatabase();
    for (let articolo of db.listino) {
        console.log(articolo.id);
        console.log(articolo.titolo);
        console.log(articolo.immagine);
        console.log(articolo.descrizione);
        console.log(articolo.quantita);
        console.log(articolo.prezzo);
        const item = document.createElement("div");
        item.innerHTML = `
            <img src="${articolo.immagine}" width="200" height="100">
            <p>${articolo.titolo}</p>
            <p>Descrizione: ${articolo.descrizione}</p>
            <p>Quantità: ${articolo.quantita}</p>
            <p>Prezzo: ${articolo.prezzo} €</p>
            <input type="number" id="customerQuantity-${articolo.id}" min="0" max="${articolo.quantita}">
            <button id="basket-${articolo.id}">Aggiugi al carrello</button>
            <hr />
        `;
        productList.append(item);
    }
}

// legge i dati dal database json
async function loadDatabase(db) {
    try {
        let response = await fetch("db.json");
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}