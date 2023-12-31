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


    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },


    createNewBoard: async function (boardTitle) {
        return await fetch(`/api/new_board`, {
            method: "PUT",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardTitle),
        })
    },


    createNewBoardPrivate: async function (userId, boardTitle) {
        return await fetch(`/api/users/${userId}/boards/new_board`, {
            method: "PUT",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardTitle),
        })
    },


    getBoardPrivate: async function (userId) {
        return await fetch(`/api/users/${userId}/boards/`, {
            method: "GET",
        })
    },


    createNewCard: async function (boardId, statusId, cardTitle) {
        return await fetch(`/api/boards/${boardId}/cards/statuses/${statusId}`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardTitle)
        });
    },

    deleteBoard: async function (boardId) {
        return await fetch(`/api/delete_board/${boardId}`, {
            method: "DELETE",
        })
    },


    deletePrivateBoard: async function (userId, boardId) {
        return await fetch(`/api/users/${userId}/delete_private_board/${boardId}`, {
            method: "DELETE",
        })
    },


    deleteColumn: async function (boardId, statusId) {
        return await fetch(`/api/boards/${boardId}/delete_column/${statusId}`, {
            method: "DELETE",
        })
    },


    deleteCard: async function (cardId) {
        return await fetch(`/api/delete_card/${cardId}`, {
            method: "DELETE",
        })
    },


    updateBoard: async function (boardId, boardTitle) {
        return await fetch(`/api/update_board/${boardId}`, {
            method: "PUT",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardTitle),
        })
    },


    updateCard: async function (cardId, cardTitle) {
        return await fetch(`/api/update_card/${cardId}`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardTitle),
        })
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


    updateCardOrder: async function (cardId, cardOrder) {
        return await fetch(`/api/update_order/${cardId}`, {
            method: "PUT",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardOrder),
        })
    },

    updateCardStatus: async function (cardId, cardStatus) {
        return await fetch(`/api/update_status/${cardId}`, {
            method: "PUT",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardStatus),
        })
    },

    updateCardArchive: async function (cardId, cardArchive) {
        return await fetch(`/api/update_archive/${cardId}/`, {
            method: "PUT",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardArchive),
        })
    },

    getCardsArchived: async function (boardId) {
        return await fetch(`/api/archived_cards/${boardId}`, {
            method: "GET",
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


