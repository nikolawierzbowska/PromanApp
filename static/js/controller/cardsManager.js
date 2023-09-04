import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {

            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);


            domManager.addChild(`.board[data-board-id="${boardId}"] .bodyCards[data-status-id="${card.status_id}"]`, content);

            orderCard()
            changeStatus()

            domManager.addEventListener(
                `button.buttonDelCard[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );


            domManager.addEventListener(
                `.buttonTitleCard[data-card-id="${card.id}"]`,
                "click",
                renameCardTitle
            );


        }
        domManager.addEventListener(
            `#addCardButton[data-board-id="${boardId}"]`,
            "click",
            createNewCard
        );


    },
};


async function createNewCard(clickEvent) {
    const statusId = 1
    const boardId = clickEvent.target.dataset.boardId
    const formAddCard = document.querySelector(`.formAddCard`)
    formAddCard.addEventListener("submit", async event => {
        event.preventDefault();
        const formData = new FormData(formAddCard);
        const data = Object.fromEntries(formData)
        const cardTitle = document.getElementById('addCardTitle').value
        if (cardTitle) {
            await dataHandler.createNewCard(boardId, statusId, data)

            const myModal = document.getElementById('addCardModal')

            const modalBootstrap = new bootstrap.Modal(myModal)
            modalBootstrap.hide()
        }
        location.reload()
    });
}


async function deleteButtonHandler(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    await dataHandler.deleteCard(cardId)
    location.reload()

}


async function renameCardTitle(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId
    const formRenameCard = document.querySelector('.formRenameCard')
    formRenameCard.addEventListener("submit", async event => {
        event.preventDefault()
        const formData = new FormData(formRenameCard);
        const data = Object.fromEntries(formData)

        await dataHandler.updateCard(cardId, data).then((response) => {
            if (response.status === 200) {
                const myModal = document.getElementById('renameCardModal')
                const modalBootstrap = new bootstrap.Modal(myModal)
                modalBootstrap.hide()

            } else {
                console.log(response.status)
            }
        })
        location.reload()
    });

}

function orderCard() {
    const cards = document.getElementsByClassName('card')
    const dragArea = document.querySelectorAll(`.bodyCards[data-status-id]`)

    for (let card of cards) {
        card.addEventListener("dragstart", function (e) {
            let selected = e.target
            console.log("dragstart")
            selected.classList.add("dragging");
            let cardId = selected.getAttribute("data-card-id");
            let cardStatus = selected.getAttribute("data-card-status");
            e.dataTransfer.setData("text/plain", cardId);
            e.dataTransfer.setData("text/status", cardStatus);
        })
    }

    for (let dragAr of dragArea) {
        dragAr.addEventListener("dragover", function (e) {
            console.log("dragover")
            e.preventDefault()
        })
    }


    for (let card of cards) {
        for (let dragAr of dragArea) {
            dragAr.addEventListener("drop", async function (e) {
                e.preventDefault();
                let selected = document.querySelector(".card.dragging");
                if (selected) {
                    let target = e.target;
                    while (target && !target.classList.contains("card")) {
                        target = target.parentElement;
                    }
                    const parent = selected.parentElement;
                    const selectedIndex = Array.from(parent.children).indexOf(selected);
                    const selectedOrder = selected.getAttribute("data-card-order");
                    const targetOrder = target.getAttribute("data-card-order");

                    const targetIndex = Array.from(parent.children).indexOf(target);
                    if (selectedIndex !== -1 && targetIndex !== -1) {
                        if (selectedIndex < targetIndex) {
                            target.after(selected);
                        } else {
                            target.before(selected);
                        }
                        selected.classList.remove("dragging");
                    }


                    selected.setAttribute("data-card-order", targetOrder);
                    target.setAttribute("data-card-order", selectedOrder);

                    let cardId = parseInt(selected.getAttribute("data-card-id"));
                    const formData = new FormData();
                    formData.append("card_order", targetOrder);
                    const data = Object.fromEntries(formData);
                    await dataHandler.updateCardOrder(cardId, data).then((response) => {
                        if (response.status === 200) {
                            console.log(response.status);
                        } else {
                            console.log(response.status);
                        }
                    });

                    let cardIdTarget = parseInt(target.getAttribute("data-card-id"));
                    const formDataTarget = new FormData();
                    formDataTarget.append("card_order", selectedOrder);
                    const dataTarget = Object.fromEntries(formDataTarget);
                    await dataHandler.updateCardOrder(cardIdTarget, dataTarget).then((response) => {
                        if (response.status === 200) {
                            console.log(response.status);
                        } else {
                            console.log(response.status);
                        }
                    });
                }

            });
        }
    }

}

function changeStatus() {
    const cards = document.getElementsByClassName('card')
    const dragArea = document.querySelectorAll(`.col[data-status-id]`)
    // const bodyCards = document.querySelectorAll(`.bodyCards`)

    for (let card of cards) {
        card.addEventListener("dragstart", function (e) {
            let selected = e.target
            console.log("dragstart")

            selected.classList.add("dragging");
            let cardId = selected.getAttribute("data-card-id");
            let cardStatus = selected.getAttribute("data-card-status");
            e.dataTransfer.setData("text/plain", cardId);
            e.dataTransfer.setData("text/status", cardStatus);
        })
    }

    for (let dragAr of dragArea) {
        dragAr.addEventListener("dragover", function (e) {
            console.log("dragover")
            e.preventDefault()
        })
    }


    for (let dragAr of dragArea) {
        dragAr.addEventListener("drop", async function (e) {
            e.preventDefault();
            let selected = document.querySelector(".card.dragging");

            if (selected) {
                let target = e.target;

                while (target && !target.classList.contains("col")) {
                    target = target.parentElement;
                }

                if (target) {
                    console.log("dragging")
                    const targetStatus = target.getAttribute("data-status-id");

                    selected.classList.remove("dragging");
                    selected.setAttribute("data-card-status", targetStatus);
                    target.appendChild(selected)

                    let cardId = parseInt(selected.getAttribute("data-card-id"));
                    const formData = new FormData();

                    formData.append("status_id", targetStatus);
                    const data = Object.fromEntries(formData);
                    await dataHandler.updateCardStatus(cardId, data).then((response) => {
                        if (response.status === 200) {
                            console.log("change status")
                            console.log(response.status);
                        } else {
                            console.log(response.status);
                        }
                    });

                }
            }
        })
    }
}



