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
                `.buttonDelCard[data-card-id="${card.id}"]`,
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
            await dataHandler.createNewCard(boardId,statusId,data)

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
    const cardId = clickEvent.target.dataset.boardId


    const formRenameStatus = document.querySelector('.formRenameStatus')
    formRenameStatus.addEventListener("submit", async event => {
        event.preventDefault()
        const formData = new FormData(formRenameStatus);
        const data = Object.fromEntries(formData)

        await dataHandler.updateStatus(boardId, statusId, data).then((response) => {
            console.log(response.status)
            if (response.status === 200) {
                const myModal = document.getElementById('renameStatusModal')
                const modalBootstrap = new bootstrap.Modal(myModal)
                modalBootstrap.hide()

            } else {
                console.log(response.status)
            }
        })
        location.reload()
    });



}

