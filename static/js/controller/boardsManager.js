import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        const statuses = await dataHandler.getStatuses();
        for (let board of boards) {

            board.statuses = statuses

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
              domManager.addEventListener(
                `.col [data-board-id="${board.id}"]`,
                "click",
                renameStatus
            );
        }

    },
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
            myModal.classList.remove('show');
            myModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
            location.reload()
        }
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
        myModal.classList.remove('show');
        myModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
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
        myModal.classList.remove('show');
        myModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
        location.reload()
    });
}


async function renameStatus(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const formRenameStatus = document.querySelector(`.formRenameStatus`)
    formRenameStatus.addEventListener("submit", async event => {
        event.preventDefault()
        const formData = new FormData(formRenameStatus);
        const data = Object.fromEntries(formData)

        await dataHandler.updateStatus(boardId, data)
        const myModal = document.getElementById('renameStatusModal')
        myModal.classList.remove('show');
        myModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
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
            myModal.classList.remove('show');
            myModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
            location.reload()
        }
    });
}


async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const board = document.querySelector(`.board[data-board-id="${boardId}"]`)
    const cards = document.querySelectorAll(".card")
    const buttons = document.querySelectorAll(`.accordion-button[data-board-id="${boardId}"]`)
    for (let b of buttons) {
        if (b.getAttribute('aria-expanded') === "true" && boardId) {

            await cardsManager.loadCards(boardId)


        } else if (b.getAttribute('aria-expanded') === "false") {
            for (let card of cards) {
                if (card.closest(`[data-board-id="${boardId}"]`)) {
                    card.style.display = "None"
                }
            }
        }
    }


}



