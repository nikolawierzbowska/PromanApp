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
    return ` <div class="board" data-board-id="${board.id}">
                <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" data-board-id=${board.id} type="button"  data-bs-toggle="collapse" data-bs-target="#collapse-${board.id}" aria-expanded="false" aria-controls="collapse-${board.id}">
                                <div class="boardTitle">${board.title}</div>
                            </button>                 
                        </h2> 
                        <div id="collapse-${board.id}" class="accordion-collapse collapse " data-bs-parent="#accordiondata-${board.id}">
                            <div class="accordion-body" id="accordionBodyId">
                                <button type="button" id="renameBoardButton" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#renameBoardModal"  data-board-id="${board.id}">Rename Board</button>
                                <button type="button" id="addCardButton" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#addCardModal" data-board-id="${board.id}"> Add Card</button>
                                <button type="button" id="deleteBoardButton" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#deleteBoardModal" data-board-id="${board.id}">Delete Board</button> 
                                <button type="button" id="addStatusButton" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#addStatusModal" data-board-id="${board.id}">Add status</button> 

                                  <div class="container text-center id=containerColumn" data-board-id="${board.id}">
                                    <div class="row align-items-start" data-board-id="${board.id}">
                                  
                                    
                                           
                                     
                                    </div>    
                                  </div> 
                            </div>
                        </div> 
                    </div>
                </div>     
            </div>`


}


function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}" data-card-status="${card.status_id}">
            <button class="buttonTitleCard" data-card-id="${card.id}">${card.title} </button>

   <div class="buttonDelCard"  data-card-id="${card.id}">\u2715</div>

</div>`;
}



