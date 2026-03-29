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
            <p id="title-${articolo.id}">${articolo.titolo}</p>
            <p id="description-${articolo.id}">Descrizione: ${articolo.descrizione}</p>
            <p id="quantity-${articolo.id}">Quantità: ${articolo.quantita}</p>
            <p id="price-${articolo.id}"id="title-${articolo.id}">Prezzo: ${articolo.prezzo} €</p>
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
            // cerco il prodotto nel carrello
            let found = false;
            for (let it of basket) {
                if (it.id === item.id) {
                    // elemento già presente: aggiorno la quantità
                    found = true;
                    for (let i of db.listino) {
                        if (i.id === item.id && i.quantita >= item.quantity) {
                            // aggiorna carrello
                            it.quantity += item.quantity;
                            // aggiorna listino
                            i.quantita -= item.quantity;
                        }
                    }
                    break;
                }
            }
            if (!found) {
                // elemento non presente: lo inserisco nel carrello
                for (let i of db.listino) {
                    if (i.id === item.id && i.quantita >= item.quantity) {
                        // aggiorna carrello
                        basket.push(item);
                        // aggiorna listino
                        i.quantita -= item.quantity;
                    }
                }
            }
            // aggiorna quantità nell'HTML
            for (let i of db.listino) {
                if (i.id === item.id) {
                    document.getElementById(`quantity-${item.id}`).innerText = `Quantità: ${i.quantita}`;
                }
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