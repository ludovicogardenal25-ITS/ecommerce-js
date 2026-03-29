"use strict";

// carrello del cliente
const basket = [];

// rappresenta la lista di prodotti nell'HTML
const productList = document.getElementById("product-list");

startApp();

// inizializza l'applicazione
async function startApp() {
    const db = await loadDatabase();
    for (let item of db.catalog) {
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${item.picture}" width="200" height="100">
            <p id="title-${item.id}">${item.title}</p>
            <p id="description-${item.id}">Descrizione: ${item.description}</p>
            <p id="quantity-${item.id}">Quantità: ${item.quantity}</p>
            <p id="price-${item.id}"id="title-${item.id}">Prezzo: ${item.price} €</p>
            <input type="number" id="customerQuantity-${item.id}" min="0" max="${item.quantity}">
            <button id="addToBasket-${item.id}">Aggiugi al carrello</button>
            <hr />
        `;
        productList.append(div);
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
                title: document.getElementById(`title-${id}`).innerText,
                quantity: Number(customerQuantity)
            };
            // cerco il prodotto nel carrello
            let found = false;
            for (let it of basket) {
                if (it.id === item.id) {
                    // elemento già presente: aggiorno la quantità
                    found = true;
                    for (let i of db.catalog) {
                        if (i.id === item.id && i.quantity >= item.quantity) {
                            // aggiorna carrello
                            it.quantity += item.quantity;
                            // aggiorna catalog
                            i.quantity -= item.quantity;
                        }
                    }
                    break;
                }
            }
            if (!found) {
                // elemento non presente: lo inserisco nel carrello
                for (let i of db.catalog) {
                    if (i.id === item.id && i.quantity >= item.quantity) {
                        // aggiorna carrello
                        basket.push(item);
                        // aggiorna catalog
                        i.quantity -= item.quantity;
                    }
                }
            }
            // aggiorna quantità nell'HTML
            for (let i of db.catalog) {
                if (i.id === item.id) {
                    document.getElementById(`quantity-${item.id}`).innerText = `Quantità: ${i.quantity}`;
                    document.getElementById(`customerQuantity-${item.id}`).setAttribute("max", i.quantity);
                }
            }

            // salva carrello e catalog
            console.log(JSON.stringify(basket));
            localStorage.setItem("userBasket", JSON.stringify(basket));
            localStorage.setItem("updatedCatalog", JSON.stringify(db.catalog));
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