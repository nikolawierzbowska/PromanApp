import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";


export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();

        for (let board of boards) {



            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);

            domManager.addChild("#root", content);
            domManager.spaceBetweenBoards(board)
            domManager.addEventListener(
                `.accordion-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
            domManager.addEventListener(
                `#buttonNewBoard`,
                "click",
                createNewBoard
            );
            domManager.addEventListener(
                `#renameBoardButton[data-board-id="${board.id}"]`,
                "click",
                renameBoardButtonHandler
            );
            domManager.addEventListener(
                `#deleteBoardButton[data-board-id="${board.id}"]`,
                "click",
                deleteBoard
            );
            domManager.addEventListener(
                `#addStatusButton[data-board-id="${board.id}"]`,
                "click",
                createNewStatus
            );
            //   domManager.addEventListener(
            //     `#new`,
            //     "click",
            //     renameStatus
            // );
        }

    },
}


async function loadStatus(boardId) {
    const statuses = await dataHandler.getStatusesFor(boardId)
    console.log(statuses)
    const board = await dataHandler.getBoard(boardId)
    const renameLink = document.getElementsByTagName('a')
    const column = document.querySelector(`.row[data-board-id="${board.id}"]`)
     column.innerHTML = ''
            statuses.forEach(item => {

                const div = document.createElement("div")
                div.classList.add("col")
                div.setAttribute(`id`,item.status_title)
                div.setAttribute(`order`, item.order_status)
                div.setAttribute(`data-board-id`, boardId)
                div.textContent = item.status_title;
                column.append(div);
            })


}


async function createNewBoard() {
    const formCreateNewBoard = document.querySelector(`.formCreateBoard`)
    formCreateNewBoard.addEventListener("submit", async event => {
        event.preventDefault();
        const formData = new FormData(formCreateNewBoard);
        const data = Object.fromEntries(formData)
        const boardTitle = document.getElementById('titleBoard').value
        if (boardTitle) {
            await dataHandler.createNewBoard(data)

            const myModal = document.getElementById('newBoardModal')

            const modalBootstrap = new bootstrap.Modal(myModal)
            modalBootstrap.hide()
        }
        location.reload()
    });
}


async function renameBoardButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const formRenameBoard = document.querySelector(`.formRenameBoard`)
    formRenameBoard.addEventListener("submit", async event => {
        event.preventDefault()

        const formData = new FormData(formRenameBoard);
        const data = Object.fromEntries(formData)
        await dataHandler.updateBoard(boardId, data)
        const myModal = document.getElementById('renameBoardModal')

        const modalBootstrap = new bootstrap.Modal(myModal)
        modalBootstrap.hide()
        location.reload();
    });
}


async function deleteBoard(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const formDeleteBoard = document.querySelector(`.formDeleteBoard`)
    formDeleteBoard.addEventListener("submit", async event => {
        event.preventDefault()

        await dataHandler.deleteBoard(boardId)
        const myModal = document.getElementById('deleteBoardModal')

        const modalBootstrap = new bootstrap.Modal(myModal)
        modalBootstrap.hide()
        location.reload()
    });
}


async function renameStatus(clickEvent) {
    const elementTitle =document.querySelector(".col")
    const textTitle = elementTitle.textContent
    console.log(textTitle)

    const boardId = clickEvent.target.dataset.boardId;
    const formRenameStatus = document.querySelector(`.formRenameStatus`)
    formRenameStatus.addEventListener("submit", async event => {
        event.preventDefault()
        const formData = new FormData(formRenameStatus);
        const data = Object.fromEntries(formData)

        await dataHandler.updateStatus(boardId, data)
        const myModal = document.getElementById('renameStatusModal')

        const modalBootstrap = new bootstrap.Modal(myModal)
        modalBootstrap.hide()
        location.reload()
    });
}


async function createNewStatus(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const formCreateNewStatus = document.querySelector(`.formAddStatus`)
    formCreateNewStatus.addEventListener("submit", async event => {
        event.preventDefault();
        const formData = new FormData(formCreateNewStatus);
        const data = Object.fromEntries(formData)
        const statusTitle = document.getElementById('addStatus').value
        if (statusTitle) {
            await dataHandler.createNewStatus(boardId, data)

            const myModal = document.getElementById('addStatusModal')
            const modalBootstrap = new bootstrap.Modal(myModal)
            modalBootstrap.hide()
            location.reload()
        }
    });
}


async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const statuses = document.querySelectorAll(".col")
    const cards = document.querySelectorAll(".card")
    const buttons = document.querySelectorAll(`.accordion-button[data-board-id="${boardId}"]`)
    for (let b of buttons) {
        if (b.getAttribute('aria-expanded') === "true" && b.getAttribute(`data-board-id`)=== boardId) {
            await loadStatus(boardId)
            await cardsManager.loadCards(boardId)

        } else if (b.getAttribute('aria-expanded') === "false") {
            for (let card of cards) {
                if (card.closest(`[data-board-id="${boardId}"]`)) {
                    card.style.display = "None"
                }
            }
            for (let stat of statuses) {
                if (stat.closest(`[data-board-id="${boardId}"]`))
                    stat.style.display = "None"
            }
        }
    }
}




