export const htmlTemplates = {
    board: 1,
    card: 2,
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder,
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<div class="board-container">
                <div class="board" data-board-id=${board.id}>${board.title}
                <button class="toggle-board-button" id="buttonUpDown"  data-board-id="${board.id}">&#9660</button>
                <button type="button" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#renameBoardModal"  data-board-id="${board.id}">
            Rename Board</button>
                <button type="button" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#addCard" data-board-id="${board.id}">
            Add Card</button>
            
            <button type="button" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#deleteBoard" data-board-id="${board.id}">
            Add Card</button>
                       
            </div></div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}



