export let domManager = {
    addChild(parentIdentifier, childContent) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.insertAdjacentHTML("beforeend", childContent);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    addEventListener(parentIdentifier, eventType, eventHandler) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.addEventListener(eventType, eventHandler);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },



    spaceBetweenBoards(bord) {
        const boards = document.querySelectorAll(".board")
        for (let board of boards) {
            // board.style.marginTop = "30px"
            // board.style.marginButton = "30px"
            // board.style.padding = "15px"
            // board.style.border = "1px solid black"
            board.parentElement.style.width = "90%"

        }
    },




};


