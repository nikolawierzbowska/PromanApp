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


            // domManager.addEventListener(
            //     `button .buttonTitleColumn[data-board-id="${board.id}"][data-status-id]`,
            //     "click",
            //     renameStatus );


        }
        createNewBoard()


    },

    loadBoardsPrivate: async function (userId) {

        dataHandler.getBoardPrivate(userId)
            .then(response => response.json())
            .then(boards => {
                console.log(boards)

                for (let board of boards) {
                    console.log(board)
                    const boardBuilder = htmlFactory(htmlTemplates.board);
                    const content = boardBuilder(board);
                    domManager.addChild("#root", content);
                    domManager.spaceBetweenBoards(board)

                }

            })


    },


    createNewBoardPrivateForm: async function (userId) {
        const formCreateNewBoardPrivate = document.querySelector(`.formCreateBoardPrivate`)
        formCreateNewBoardPrivate.addEventListener("submit", async event => {
            event.preventDefault();
            const formData = new FormData(formCreateNewBoardPrivate);
            const data = Object.fromEntries(formData)
            const boardTitlePrivate = document.getElementById('titleBoardPrivate').value
            if (boardTitlePrivate) {
                console.log(boardTitlePrivate)
                await dataHandler.createNewBoardPrivate(userId, data).then((response) => {
                    console.log(userId)
                    console.log(data)

                    const myModal = document.getElementById('newBoardModal')

                    const modalBootstrap = new bootstrap.Modal(myModal)
                    modalBootstrap.hide()

                    const activeBoards = document.querySelectorAll(`.board[data-board-id]`)
                    activeBoards.forEach(activeBoard => {
                        activeBoard.remove()
                    })
                    // boardsManager.loadBoards()
                    boardsManager.loadBoardsPrivate(userId)
                })

            }
        });
    },


}


// async function getStatus(boardId, statusId) {
//     const status = await  dataHandler.getStatus(boardId, statusId)
//
//
// }


async function loadStatus(boardId) {
    const statuses = await dataHandler.getStatusesForBoard(boardId)
    const board = await dataHandler.getBoard(boardId)

    const column = document.querySelector(`.bodyCard[data-board-id="${board.id}"]`)
    column.innerHTML = ''
    statuses.forEach(item => {
        const div = document.createElement("div")
        div.classList.add("col")
        div.setAttribute(`data-status-id`, item.id)
        const icon = '\u2715'
        const deleteButton = document.createElement("button")
        deleteButton.setAttribute(`data-board-id`, boardId)
        deleteButton.setAttribute(`data-status-id`, item.id)
        deleteButton.classList.add("buttonDel")
        deleteButton.innerText = icon;
        div.appendChild(deleteButton)

        div.setAttribute(`data-board-id`, boardId)

        const headerDiv = document.createElement('div')
        headerDiv.classList.add("headerTitle")
        headerDiv.setAttribute(`data-board-id`, boardId)


        const button = document.createElement("button");


        button.classList.add("buttonTitleColumn")
        button.setAttribute("id", item.title)
        button.setAttribute("data-bs-toggle", "modal");
        button.setAttribute("data-bs-target", "#renameStatusModal");
        button.setAttribute("data-status-id", item.id);
        button.setAttribute("data-board-id", board.id);
        button.setAttribute("type", "button");
        // button.setAttribute("href", "#renameStatusModal")
        button.innerText = item.status_title;

        headerDiv.appendChild(button)
        div.appendChild(headerDiv)
        column.appendChild(div);

        const bodyCards = document.createElement("div")
        bodyCards.classList.add("bodyCards")
        bodyCards.setAttribute("data-status-id", item.id)
        div.appendChild(bodyCards)

        domManager.addEventListener(
            `.buttonTitleColumn[data-board-id="${board.id}"][data-status-id="${item.id}"]`,
            "click",
            renameStatus
        );


        domManager.addEventListener(
            `.buttonDel[data-board-id="${board.id}"][data-status-id="${item.id}"]`,
            "click",
            deleteColumnId
        );


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
            await dataHandler.createNewBoard(data).then((response) => {
                if (response.status === 200) {
                    const myModal = document.getElementById('renameCardModal')
                    formCreateNewBoard.reset()
                    const modalBootstrap = new bootstrap.Modal(myModal)
                    modalBootstrap.hide()

                    const activeBoards = document.querySelectorAll(`.board[data-board-id]`)
                    activeBoards.forEach(activeBoard => {
                        activeBoard.remove()
                    })
                    // boardsManager.loadBoards()
                    window.location.reload()
                }
            })
        }
    });
}


async function renameBoardButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    console.log(boardId)
    const formRenameBoard = document.querySelector(`.formRenameBoard`)
    formRenameBoard.addEventListener("submit", async event => {
        event.preventDefault()

        const formData = new FormData(formRenameBoard);
        const data = Object.fromEntries(formData)
        await dataHandler.updateBoard(boardId, data).then((response) => {
            if (response.status === 200) {
                const myModal = document.getElementById('renameBoardModal')
                formRenameBoard.reset()
                const modalBootstrap = new bootstrap.Modal(myModal)
                modalBootstrap.hide()
                const activeBoards = document.querySelectorAll(`.board[data-board-id]`)
                activeBoards.forEach(activeBoard => {
                    activeBoard.remove()

                })
            }
        })
        location.reload();
    });
}


async function deleteBoard(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const formDeleteBoard = document.querySelector(`.formDeleteBoard`)
    formDeleteBoard.addEventListener("submit", async event => {
        event.preventDefault()

        await dataHandler.deleteBoard(boardId).then((response) => {
            if (response.status === 200) {
                const myModal = document.getElementById('deleteBoardModal')
                const modalBootstrap = new bootstrap.Modal(myModal)
                modalBootstrap.hide()
                const activeBoards = document.querySelectorAll(`.board[data-board-id]`)
                activeBoards.forEach(activeBoard => {
                    activeBoard.remove()
                })
                boardsManager.loadBoards()


            }
        })

    });
}


async function renameStatus(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId
    const statusId = clickEvent.target.dataset.statusId

    const formRenameStatus = document.querySelector('.formRenameStatus')
    formRenameStatus.addEventListener("submit", async event => {
        event.preventDefault()
        const formData = new FormData(formRenameStatus);
        const data = Object.fromEntries(formData)

        await dataHandler.updateStatus(boardId, statusId, data).then((response) => {

            if (response.status === 200) {
                console.log(response.status)
                const myModal = document.getElementById('renameStatusModal')
                const modalBootstrap = new bootstrap.Modal(myModal)
                modalBootstrap.hide()
            }

        })
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
        if (b.getAttribute('aria-expanded') === "true" && b.getAttribute(`data-board-id`) === boardId) {
            await loadStatus(boardId)
            await cardsManager.loadCards(boardId)


        } else if (b.getAttribute('aria-expanded') === "false") {

            for (let card of cards) {
                if (card.closest(`[data-board-id="${boardId}"]`)) {
                    card.style.display = "None"
                }
            }
            for (let stat of statuses) {
                if (stat.closest(`[data-board-id="${boardId}"]`)) {
                    stat.style.display = "None"
                }
            }


        }
    }
}


async function deleteColumnId(clickEvent) {
    const statusId = clickEvent.target.dataset.statusId;
    const boardId = clickEvent.target.dataset.boardId
    await dataHandler.deleteColumn(boardId, statusId).then((response) => {
        if (response.status === 200) {
            console.log("deleted column")
            const columns = document.querySelectorAll(`.col[data-status-id]`)
            columns.forEach(column => {
                if (column.getAttribute("data-status-id") === statusId) {
                    column.style.display = "none"
                }


            })

        }

    })


}


