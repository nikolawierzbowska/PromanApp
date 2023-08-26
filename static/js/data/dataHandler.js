export let dataHandler = {
    createUser: async function (data) {
        return await fetch(`/api/users`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    },


    postUser: async function (data) {
        return await fetch(`/api/users/login`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    },


    logoutUser: async function () {
        return await fetch(`/api/users/logout`, {
            method: "GET",
        })
    },


    getBoards: async function () {
        return await apiGet(`/api/boards`);
    },


    getStatusesForBoard: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/statuses`)

    },


    getBoard: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}`);
    },


    // getStatuses: async function () {
    //     return await apiGet(`/api/boards/statuses`)
    //     // the statuses are retrieved and then the callback function is called with the statuses
    // },


    getStatus: async function (boardId, statusId) {
        return await apiGet(`/api/boards/${boardId}/statuses/${statusId}`)

    },





    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {
        return await apiGet(`/api/boards/cards/${cardId}`)
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (boardTitle) {
        return await apiPut(`/api/new_board`, boardTitle)
        // creates new board, saves it and calls the callback function with its data
    },
    createNewCard: async function (boardId, statusId, cardTitle) {
        return await apiPost(`/api/boards/${boardId}/cards/statuses/${statusId}`, cardTitle)
        // creates new card, saves it and calls the callback function with its data
    },

    deleteBoard: async function (boardId) {
        return await apiDelete(`/api/delete_board/${boardId}`)
    },


    deleteColumn: async function (boardId, statusId) {
     return await apiDelete(`/api/boards/${boardId}/delete_column/${statusId}`)
    },


    deleteCard: async function (cardId) {
        return await apiDelete(`/api/delete_card/${cardId}`)
    },
    updateBoard: async function (boardId, boardTitle) {
        return await apiPatch(`/api/update_board/${boardId}`, boardTitle)
    },
    updateCard: async function (cardId, cardTitle) {
        return await apiPatch(`/api/delete_card/${cardId}`, cardTitle)
    },

    createNewStatus: async function (boardId, statusTitle) {
        return await apiPut(`/api/boards/${boardId}/new_status`, statusTitle)
    },


    updateStatus: async function (boardId, statusId, statusTitle) {
        return await fetch(`/api/boards/${boardId}/update_status/${statusId}`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(statusTitle),
        })
    },

};


async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}


async function apiPost(url, payload) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (response.ok) {
        return await response.json();
    }
}


async function apiDelete(url) {
    const response = await fetch(url, {
        method: "DELETE",
    });
    if (response.ok) {
        return await response.json();
    }
}


async function apiPatch(url, payload) {
    const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    });
    if (response.ok) {
        return await response.json();
    }
}


async function apiPut(url, payload) {
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (response.ok) {
        return await response.json();
    }
}


