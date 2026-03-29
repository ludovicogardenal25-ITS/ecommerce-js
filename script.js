"use strict";

// carrello del cliente
const basket = [];

// rappresenta la lista di prodotti nell'HTML
const productList = document.getElementById("product-list");

startApp();

// inizializza l'applicazione
async function startApp() {
    const db = await loadDatabase();
    for (let articolo of db.listino) {
        const item = document.createElement("div");
        item.innerHTML = `
            <img src="${articolo.immagine}" width="200" height="100">
            <p>${articolo.titolo}</p>
            <p>Descrizione: ${articolo.descrizione}</p>
            <p>Quantità: ${articolo.quantita}</p>
            <p>Prezzo: ${articolo.prezzo} €</p>
            <input type="number" id="customerQuantity-${articolo.id}" min="0" max="${articolo.quantita}">
            <button id="addToBasket-${articolo.id}">Aggiugi al carrello</button>
            <hr />
        `;
        productList.append(item);
    }

    const buttons = document.querySelectorAll('main button');
    buttons.forEach((button) => {
        button.addEventListener('click', function (event) {
            // id del bottone
            const fullId = event.target.getAttribute("id");
            // id del prodotto interessato
            const id = fullId.split("-")[1];
            // quantità ordinata dal cliente
            const customerQuantity = document.getElementById(`customerQuantity-${id}`).value;
            const item = {
                id: Number(id),
                quantity: Number(customerQuantity)
            };

            // cerco il prodotto nella lista
            let found = false;
            for (let it of basket) {
                if (it.id === item.id) {
                    // elemento già presente: aggiorno la quantità
                    found = true;
                    it.quantity += item.quantity;
                    break;
                }
            }
            if (!found) {
                // elemento non presente: lo inserisco nel carrello
                basket.push(item);
            }
        });
    });

}

// legge i dati dal database json
async function loadDatabase(db) {
    try {
        let response = await fetch("db.json");
        return await response.json();
    } catch (error) {
        alert(error);
    }
}