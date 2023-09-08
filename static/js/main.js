import {boardsManager} from "./controller/boardsManager.js";
import {dataHandler} from "./data/dataHandler.js";
import {domManager} from "./view/domManager.js";



function init() {


    addLoginFormListener()
    addRegisterFormListener()
    logout()

    boardsManager.loadBoards();



}


init();


function addRegisterFormListener() {
    const errors = document.querySelector("#errors")
    const formRegister = document.querySelector('.formRegister');
    formRegister.addEventListener('submit', async event => {
        event.preventDefault();

        const formData = new FormData(formRegister);
        const data = Object.fromEntries(formData)
        const isValid = validateRegisterForm()

        if (isValid) {
            await dataHandler.createUser(data).then((response) => {

                if (response.status === 200) {
                    const myModal = document.getElementById('registerModal')
                    formRegister.reset()
                    myModal.classList.remove('show');
                    myModal.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    document.querySelector('.modal-backdrop').remove();
                    document.getElementById('logoutButton').style.display = 'none';
                    document.getElementById('registerButton').style.displayy = 'none';
                    document.getElementById('loginButton').style.display= "block";
                    document.getElementById('buttonNewBoardPrivate').style.display = 'none';
                } else if (response.status === 404 || response.status === 401) {
                    response.json()
                    .then(data => errors.textContent = data)
                }

            })
        }
    })

}


function validateRegisterForm() {
    const userName = document.getElementById("userName").value
    const password = document.getElementById("passwordRegister").value
    const passwordRepeat = document.getElementById("password-repeat").value

    if (userName.length < 6) {
        document.getElementById("messageUserName").innerHTML = "Length must be at least 6 characters"
        return false
    } else {
        document.getElementById("messageUserName").innerHTML = ""
    }

    if (password.length < 5) {
        document.getElementById("messagePassword").innerHTML = "Length must be at least 6 characters"
        return false
    } else {
        document.getElementById("messagePassword").innerHTML = ""
    }

    if (passwordRepeat !== password) {
        document.getElementById("messagePasswordRepeat").innerHTML = "Passwords not match"
        return false;
    } else {

        document.getElementById("messagePasswordRepeat").innerHTML = ""

    }
    return true
}


function addLoginFormListener() {
    const errors = document.querySelector("#errors")
    const formLogin = document.querySelector('.formLogin');
    formLogin.addEventListener('submit', async event => {
        event.preventDefault();

        const formData = new FormData(formLogin);
        const data = Object.fromEntries(formData)


        await dataHandler.postUser(data).then((response) => {
            console.log(response)
            if (response.status === 200) {
                response.json().then((userData) => {
                    const userId = userData["user_id"];
                    console.log(userId)
                    boardsManager.loadBoardsPrivate(userId)
                    boardsManager.createNewBoardPrivateForm(userId)





                    const myModal = document.getElementById('loginModal')
                    formLogin.reset()
                    myModal.classList.remove('show');
                    myModal.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    document.querySelector('.modal-backdrop').remove();
                    document.getElementById('logoutButton').style.display = 'block';
                    document.getElementById('buttonNewBoard').style.display = 'none';
                    document.getElementById('buttonNewBoardPrivate').style.display = 'block';
                    document.getElementById('registerButton').style.display = 'none';
                    document.getElementById('loginButton').style.display = "none";
                })
            } else if (response.status === 404 || response.status === 401) {
                response.json()
                .then(data => errors.textContent = data)
            }


        })
    })
}


function logout() {
    const buttonLogOut = document.getElementById('logoutButton')
    buttonLogOut.addEventListener("click", async event => {
        event.preventDefault();

        await dataHandler.logoutUser().then((response) => {
            console.log(response)
            if (response.ok) {
                   const activeBoards = document.querySelectorAll(`.board[data-board-id]`)
                    activeBoards.forEach(activeBoard => {
                        activeBoard.remove()
                    })
                boardsManager.loadBoards()



                document.getElementById('logoutButton').style.display = 'none';
                document.getElementById('registerButton').style.display = 'block';
                document.getElementById('loginButton').style.display = "block";
                document.getElementById('buttonNewBoardPrivate').style.display = 'none';
                document.getElementById('buttonNewBoard').style.display = 'block';
            }
        })
    })

}









