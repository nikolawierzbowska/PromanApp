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
                // `.toggle-board-button[data-board-id="${board.id}"]`,
                `.accordion-button`,
                "click",
                showHideButtonHandler
            );


        }
    },

    createNewBoard: function() {
        const formCreateNewBoard = document.querySelector(`.formCreateBoard`)
        formCreateNewBoard.addEventListener("submit", async event => {
            event.preventDefault();
            const formData = new FormData(formCreateNewBoard);
            const data = Object.fromEntries(formData)
            const boardTitle = document.getElementById('titleBoard').value
            if(boardTitle) {
                await dataHandler.createNewBoard(data)

                const myModal =document.getElementById('newBoardModal')
                myModal.classList.remove('show');
                myModal.style.display = 'none';
                document.body.classList.remove('modal-open');
                const modalBackdrop = document.querySelector('.modal-backdrop');
                if (modalBackdrop) {
                    modalBackdrop.remove();
            }
                location.reload()

        }});
    },

    renameBoard: function() {
        const formRenameBoard = document.querySelector(`.formRenameBoard`)
        formRenameBoard.addEventListener("submit", async event => {
            event.preventDefault()
            const formData = new FormData(formRenameBoard);
            const boardIdElement = document.querySelector(`.board[data-board-id]`)
            const boardId = boardIdElement.dataset.boardId
            const data = Object.fromEntries(formData)

            await dataHandler.updateBoard(boardId,data)
            const myModal =document.getElementById('renameBoardModal')
                myModal.classList.remove('show');
                myModal.style.display = 'none';
                document.body.classList.remove('modal-open');
                const modalBackdrop = document.querySelector('.modal-backdrop');
                if (modalBackdrop) {
                    modalBackdrop.remove();
            }
                location.reload()
        });
    },


     deleteBoard: function() {
        const formDeleteBoard = document.querySelector(`.formDeleteBoard`)
         formDeleteBoard.addEventListener("submit", async event => {
            event.preventDefault()
            // const formData = new FormData(formRenameBoard);
            const boardIdElement = document.querySelector(`.board[data-board-id]`)
            const boardId = boardIdElement.dataset.boardId
            // const data = Object.fromEntries(formData)

            await dataHandler.deleteBoard(boardId)
            const myModal =document.getElementById('deleteBoardModal')
                myModal.classList.remove('show');
                myModal.style.display = 'none';
                document.body.classList.remove('modal-open');
                const modalBackdrop = document.querySelector('.modal-backdrop');
                if (modalBackdrop) {
                    modalBackdrop.remove();
            }
                location.reload()
        });
    },
















};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const buttons = document.querySelectorAll(`.toggle-board-button[data-board-id="${boardId}"]`);
    const cards = document.querySelectorAll(".card")

    const accordionItem = document.querySelector(`.accordion-item[data-board-id="${boardId}"]`)
    const accordionButtons = document.querySelectorAll(`.accordion-button`)
    console.log(accordionButtons)
    accordionButtons.forEach(function (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('show');
    });


    clickEvent.target.setAttribute('aria-expanded', 'true');
    clickEvent.target.classList.add('show');

    accordionItem.querySelector('.accordion-collapse').classList.add('collapse');
    accordionItem.querySelector('.accordion-collapse').classList.remove('show');
}




    // for (let button of buttons) {
    //     if (button.innerHTML === "▼") {
    //         cardsManager.loadCards(boardId)
    //         button.innerHTML = "▲"
    //     } else if (button.innerHTML === "▲" ) {
    //         for (let card of cards) {
    //             if (card.closest(`[data-board-id="${boardId}"]`)) {
    //                 card.style.display = "None"
    //                 button.innerHTML = "▼"
    //             }
    //         }
    //     }
    // }
// }


