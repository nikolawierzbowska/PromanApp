import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {

            const cardBuilder = htmlFactory(htmlTemplates.card);

            const content = cardBuilder(card);


            domManager.addChild(`.board[data-board-id="${boardId}"] .col`, content);
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );


        }
         domManager.addEventListener(
                `#addCardButton[data-board-id="${boardId}"]`,
                "click",
                createNewCard(boardId)
            );

    },
};


async function createNewCard(boardId) {
const statusId = 1
    const formAddCard = document.querySelector(`.formAddCard`)
    formAddCard.addEventListener("submit", async event => {
        event.preventDefault();
        const formData = new FormData(formAddCard);
        const data = Object.fromEntries(formData)
        const cardTitle = document.getElementById('addCardTitle').value
        if (cardTitle) {
            await dataHandler.createNewCard(boardId,statusId,data)

            const myModal = document.getElementById('addCardModal')

            const modalBootstrap = new bootstrap.Modal(myModal)
            modalBootstrap.hide()
        }
        location.reload()
    });
}








function deleteButtonHandler(clickEvent) {
}


