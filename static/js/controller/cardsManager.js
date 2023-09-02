import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {

            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            orderCard()

            domManager.addChild(`.board[data-board-id="${boardId}"] .col`, content);




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
    let cards = document.getElementsByClassName('card')
    let columns = document.getElementsByClassName('col[data-status-id]')

    for(let card of cards) {
        card.addEventListener("dragstart", function (e) {
            let selected =e.target

            for (let column of columns) {
                column.addEventListener("dragover", function (e) {
                    e.preventDefault()
                })
                column.addEventListener("drop", function (e) {
                    column.appendChild(selected)
                    selected = null
                })
            }
            })
    }
}
