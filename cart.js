"use strict";

// rappresenta il carrello di prodotti nell'HTML
const cartList = document.getElementById("cart-list");

// legge i dati dal local storage
const basket = JSON.parse(localStorage.getItem("userBasket"));
const catalog = JSON.parse(localStorage.getItem("updatedCatalog"));

startCart();

function startCart() {
    for (let item of basket) {
        const div = document.createElement("div");
        div.innerHTML = `
            <p id="title-${item.id}">${item.title}</p>
            <p id="quantity-${item.id}">Quantità: ${item.quantity}</p>
            <button class="increaseBasket" id="increaseBasket-${item.id}">Aggiungi</button>
            <button class="decreaseBasket" id="decreaseBasket-${item.id}">Rimuovi</button>
            <hr />
        `;
        cartList.append(div);
    }

    const removeButtons = document.querySelectorAll(".decreaseBasket");
    removeButtons.forEach((button) => {
        button.addEventListener('click', function (event) {
            // id del bottone
            const fullId = event.target.getAttribute("id");
            // id del prodotto interessato
            const id = Number(fullId.split("-")[1]);
            // controllo se disponibile nel carrello
            let available = false;
            for (let j of basket) {
                if (j.id === id && j.quantity > 0) {
                    available = true;
                    break;
                }
            }
            if (available) {
                // decrementa carrello
                for (let j of basket) {
                    if (j.id === id && j.quantity > 0) {
                        j.quantity -= 1;
                        break;
                    }
                }
                // incrementa listino
                for (let j of catalog) {
                    if (j.id === id) {
                        j.quantity += 1;
                        break;
                    }
                }
                // aggiorna HTML
                for (let j of basket) {
                    if (id === j.id) {
                        document.getElementById(`quantity-${id}`).innerText = `Quantità: ${j.quantity}`;
                        break;
                    }
                }
                localStorage.setItem("userBasket", JSON.stringify(basket));
                localStorage.setItem("updatedCatalog", JSON.stringify(catalog));
            }
        });
    });

    const addButtons = document.querySelectorAll(".increaseBasket");
    addButtons.forEach((button) => {
        button.addEventListener('click', function (event) {
            // id del bottone
            const fullId = event.target.getAttribute("id");
            // id del prodotto interessato
            const id = Number(fullId.split("-")[1]);
            // controllo se disponibile nel listino
            let available = false;
            for (let j of catalog) {
                if (j.id === id && j.quantity > 0) {
                    available = true;
                    break;
                }
            }
            if (available) {
                // decrementa listino
                for (let j of catalog) {
                    if (j.id === id) {
                        j.quantity -= 1;
                        break;
                    }
                }
                // incrementa carrello
                for (let j of basket) {
                    if (j.id === id && j.quantity >= 0) {
                        j.quantity += 1;
                        break;
                    }
                }
                // aggiorna HTML
                for (let j of basket) {
                    if (id === j.id) {
                        document.getElementById(`quantity-${id}`).innerText = `Quantità: ${j.quantity}`;
                        break;
                    }
                }
                localStorage.setItem("userBasket", JSON.stringify(basket));
                localStorage.setItem("updatedCatalog", JSON.stringify(catalog));
            }
        });
    });
}