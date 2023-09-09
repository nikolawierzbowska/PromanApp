import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {boardsManager} from "./boardsManager.js";

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
                `button.buttonArchive[data-card-id="${card.id}"]`,
                "click",
                archiveCards
            );


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
            `#archiveButton[data-board-id="${boardId}"]`,
            "click",
            archivedCardButton
        );


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
            await dataHandler.createNewCard(boardId, statusId, data).then((response => {
                const myModal = document.getElementById('addCardModal')
                formAddCard.reset()
                const modalBootstrap = new bootstrap.Modal(myModal)
                modalBootstrap.hide()

            }))
            const cardsStatusFalse = document.querySelectorAll(`.card[data-card-archive="${false}"]`)
            cardsStatusFalse.forEach(cardFalse => {
                cardFalse.remove()
            })
            cardsManager.loadCards(boardId)

        }

    });
}


async function deleteButtonHandler(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    const boardId = clickEvent.target.dataset.boardId
    await dataHandler.deleteCard(cardId).then((response) => {
         const cardsStatusFalse = document.querySelectorAll(`.card[data-card-archive="${false}"]`)
            cardsStatusFalse.forEach(cardFalse => {
                cardFalse.remove()
            })
            cardsManager.loadCards(boardId)
    })
}


async function renameCardTitle(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId
    const boardId = clickEvent.target.dataset.boardId
    console.log(boardId)
    const formRenameCard = document.querySelector('.formRenameCard')
    formRenameCard.addEventListener("submit", async event => {
        event.preventDefault()
        const formData = new FormData(formRenameCard);
        const data = Object.fromEntries(formData)

        await dataHandler.updateCard(cardId, data).then((response) => {
            if (response.status === 200) {
                    const myModal = document.getElementById('renameCardModal')
                    formRenameCard.reset()
                    const modalBootstrap = new bootstrap.Modal(myModal)
                    modalBootstrap.hide()

                    const cardsStatusFalse = document.querySelectorAll(`.card[data-card-archive="${false}"]`)
                    cardsStatusFalse.forEach(cardFalse => {
                        console.log("remove cards")
                        cardFalse.remove()
                    })
                    cardsManager.loadCards(boardId)
            }
        })
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


function archiveCards(clickEvent) {
    const cards = document.querySelectorAll(".card")

    for (let card of cards) {
        const cardId = clickEvent.target.dataset.cardId
        const buttonsArchive = document.querySelectorAll(`.buttonArchive[data-card-id="${cardId}"]`)
        card.setAttribute("data-card-archive", "true")

        const boardId = card.getAttribute("data-board-id")
        console.log(boardId)
        const containersArchive = document.querySelectorAll(`.containerArchive[data-board-id="${boardId}"]`)


        for (let button of buttonsArchive) {
            button.addEventListener("click", evt => {
                console.log("klik")
                const formData = new FormData();
                formData.append("archive", "true");
                const data = Object.fromEntries(formData);
                dataHandler.updateCardArchive(cardId, data).then((response) => {
                    if (response.status === 200) {
                        if (card.getAttribute("data-card-id") === cardId) {
                            card.style.display = "none"
                            console.log("archived card ok")
                            for (let containerArchive of containersArchive) {
                                containerArchive.appendChild(card)
                                const buttonArchive = document.querySelectorAll(".buttonArchive")
                                const buttonsDel = document.querySelectorAll(".buttonDelCard")

                                for (let button of buttonArchive) {
                                    for (let buttonDel of buttonsDel) {
                                        if (containerArchive.contains(button) && containerArchive.contains(buttonDel)) {
                                            buttonDel.textContent = ""
                                            button.textContent = "A"
                                            card.style.display = "block"
                                            console.log("unarchived card show")
                                        }
                                    }
                                }

                            }
                        } else {
                            console.log(response.status);
                        }
                    }

                })
            })
        }
    }
}


async function archivedCardButton(clickEvent) {

    const boardId = clickEvent.target.dataset.boardId
    const containerBoards = document.querySelectorAll(`.container[data-board-id="${boardId}"]`)

    for (let containerBoard of containerBoards) {

        await dataHandler.getCardsArchived(boardId).then((response) => {

                response.json().then((cards) => {
                    if (cards.length === 0) {
                        window.alert("not archived cards")
                        console.log("not archived cards")

                    } else {
                        const containerArchive = document.createElement("div")
                        const buttonCloseArchived = document.createElement("button")
                        buttonCloseArchived.classList.add("closeArchived")
                        buttonCloseArchived.setAttribute("type", "button")
                        buttonCloseArchived.setAttribute("data-board-id", boardId)
                        buttonCloseArchived.innerHTML = "Close"
                        containerArchive.appendChild(buttonCloseArchived)
                        const titleArchived = document.createElement("div")
                        titleArchived.classList.add("titleArchived")
                        titleArchived.innerHTML = "Archived cards:"
                        containerArchive.appendChild(titleArchived)
                        containerArchive.classList.add("containerArchive")
                        containerArchive.setAttribute("data-board-id", boardId)
                        containerBoard.parentNode.insertBefore(containerArchive, containerBoard)


                        cards.forEach(card => {
                            const cardId = card.id
                            const cardBuilder = htmlFactory(htmlTemplates.card);
                            const content = cardBuilder(card);
                            domManager.addChild(`.containerArchive[data-board-id="${boardId}"]`, content.replace('☁', "A").replace("✕", ""));


                            domManager.addEventListener(
                                `.buttonArchive[data-card-id="${cardId}"]`,
                                "click",
                                unArchived
                            );

                        })
                    }


                    domManager.addEventListener(
                        `button.closeArchived[data-board-id="${boardId}"]`,
                        "click",
                        closeArchived
                    );


                })

            }
        )


    }


}


async function closeArchived() {
    const buttons = document.querySelectorAll(".closeArchived")
    for (let button of buttons) {
        const boardId = button.getAttribute("data-board-id")
        const archivedTable = document.querySelectorAll(`.containerArchive[data-board-id="${boardId}"]`)
        for (let table of archivedTable) {
            table.style.display = "none"
            table.remove()


        }
        // window.location.reload()

    }

}


async function unArchived(clickEvent) {
    const cards = document.querySelectorAll(".card")
    for (let card of cards) {
        const cardId = clickEvent.target.dataset.cardId
        const cardStatus = card.getAttribute("data-card-status")
        const col = document.querySelectorAll(`.col[data-status-id="${cardStatus}"]`)

        const boardId = card.getAttribute("data-board-id")
        const containersArchive = document.querySelectorAll(`.containerArchive[data-board-id="${boardId}"]`)

        card.setAttribute("data-card-archive", "false")
        const unArchivedButtons = document.querySelectorAll(`.buttonArchive[data-card-id="${cardId}"]`)

        for (let containerArchive of containersArchive) {
            for (let c of col) {
                const cardsInArchived = containerArchive.querySelectorAll(".card")

                for (let unArchivedButton of unArchivedButtons) {
                    unArchivedButton.addEventListener("click", event => {

                        const formData = new FormData();
                        formData.append("archive", "false");
                        const data = Object.fromEntries(formData);
                        dataHandler.updateCardArchive(cardId, data).then((response) => {

                            if (card.getAttribute("data-card-id") === cardId && cardsInArchived.length > 0) {
                                const cardsStatusFalse = document.querySelectorAll(`.card[data-card-archive="${false}"]`)
                                cardsStatusFalse.forEach(cardFalse => {
                                    cardFalse.remove()
                                    containerArchive.remove()
                                })
                                cardsManager.loadCards(boardId)
                            }
                        })
                    })
                }
            }
        }
    }
}

