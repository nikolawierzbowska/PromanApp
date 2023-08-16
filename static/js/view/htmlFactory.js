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
    return `<div class="accordion" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <div class="board" data-board-id=${board.id}>${board.title}</div></button>
                    <button type="button" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#renameBoardModal"  data-board-id="${board.id}">Rename Board</button>
                    <button type="button" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#addCardModal" data-board-id="${board.id}"> Add Card</button>
                    <button type="button" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#deleteBoardModal" data-board-id="${board.id}">Delete Board</button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse " data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    <div class="container text-center">
                          <div class="row align-items-start">
                            <div class="col"> New
                                <div class="board-column-content">
                                    <div class="card">
                                    </div>
                                </div>
                            </div>    
                            <div class="col">In Progress
                                <div class="board-column-content">
                                    <div class="card">
                                    </div>
                                </div>
                            </div>    
                            <div class="col">Testing
                                <div class="board-column-content">
                                    <div class="card">
                                    </div>
                                </div>
                            </div>    
                             <div class="col">Done
                                <div class="board-column-content">
                                    <div class="card">
                                    </div>
                                </div>
                             </div>   
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>`


}











function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}



