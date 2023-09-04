from flask import Flask, render_template, url_for, request, jsonify, session
import bcrypt as bcrypt
from dotenv import load_dotenv
from util import json_response
import mimetypes

from data_handler import boards_handler, cards_handler, status_handler, users_handler

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()

app.secret_key = "96449384-97ca-4e24-bdec-58a7dc8f59fc"


@app.route('/api/users/', methods=['POST'])
def registration():
    data = request.json
    user_name = data["userName"]
    email = data["email"]
    password = data["passwordRegister"]

    if users_handler.get_user_by_name(user_name, email):
        return jsonify(["User with this name or email already exists."]), 401

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user_id = users_handler.add_user(user_name, email, hashed_password.decode("utf-8"))

    if user_id:

        return jsonify(["Registration successful."]), 200
    else:
        return jsonify(["'Unknown error, please try again"]), 401


@app.route('/api/users/login', methods=['POST'])
def login():
    data = request.json
    user_name_email = data["userNameEmail"]
    password = data["passwordLogin"]

    user = users_handler.get_user_by_name(user_name_email, user_name_email)

    if not user:
        return jsonify(["User not found"]), 404

    is_password_correct = bcrypt.checkpw(password.encode("utf-8"), user['password'].encode("utf-8"))

    if is_password_correct:
        session["userNameEmail"] = user_name_email
        session['is_logged'] = True
        session['user_id'] = user['id']
        return jsonify(["Login successful"]), 200
    else:
        return jsonify(["Incorrect username/email or password."]), 404


def is_logged():
    return "is_logged" in session and session["is_logged"]


@app.route('/api/users/logout', methods=['GET'])
def logout():
    session.clear()
    return jsonify(["Logout"]), 200


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    return boards_handler.get_boards()


@app.route("/api/boards/<int:board_id>")
@json_response
def get_board(board_id: int):
    return boards_handler.get_board(board_id)


@app.route("/api/new_board", methods=["PUT"])
@json_response
def create_new_board():
    data = request.json
    boards_handler.add_board(data["titleBoard"])
    return data


@app.route("/api/boards/<int:board_id>/cards/statuses/<int:status_id>", methods=["POST"])
@json_response
def create_new_cards(board_id: int, status_id: int):
    data = request.json
    return cards_handler.add_card(board_id, status_id, data["addCardTitle"])


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    return cards_handler.get_cards_for_board(board_id)


@app.route("/api/boards/<int:board_id>/statuses/<int:status_id>")
@json_response
def get_status(board_id:int, status_id:int):
    return status_handler.get_status(board_id, status_id)


@app.route("/api/boards/<int:board_id>/statuses/")
@json_response
def get_statuses_for_board(board_id: int):
    return status_handler.get_statuses_for_board_id(board_id)


@app.route("/api/boards/cards/<int:card_id>")
@json_response
def get_card(card_id):
    return cards_handler.get_card_by_id(card_id)


@app.route("/api/delete_board/<int:board_id>", methods=["DELETE"])
@json_response
def delete_board(board_id: int):
    return boards_handler.delete_board_by_id(board_id)


@app.route("/api/boards/<int:board_id>/delete_column/<int:status_id>", methods=["DELETE"])
@json_response
def delete_column(board_id: int, status_id: int):
    return status_handler.delete_column(board_id, status_id)


@app.route("/api/delete_card/<int:card_id>", methods=["DELETE"])
@json_response
def delete_card(card_id:int):
    return cards_handler.delete_card_by_id(card_id)


@app.route("/api/update_board/<int:board_id>", methods=["PATCH"])
@json_response
def update_board(board_id: int):
    data = request.json
    boards_handler.update_board_by_id(board_id, data["renameBoard"])
    return data


@app.route("/api/update_card/<int:card_id>", methods=["POST"])
@json_response
def update_card_title(card_id: int):
    data = request.json
    return cards_handler.update_card_title_by_id(card_id, data["renameCard"])



@app.route("/api/boards/<int:board_id>/update_status/<int:status_id>", methods=["POST"])
@json_response
def update_status_title(board_id: int, status_id: int):
    data = request.json
    return status_handler.update_status(board_id, status_id, data["renameStatus"])



@app.route("/api/boards/<int:board_id>/new_status/", methods=["PUT"])
@json_response
def add_status_title(board_id:int):
    data = request.json
    return status_handler.add_status(board_id, data["addStatus"])



@app.route("/api/update_order/<int:card_id>/", methods=["PUT"])
@json_response
def update_card_order(card_id: int):
    data = request.json
    return cards_handler.update_card_order_by_id(card_id, data["card_order"])


@app.route("/api/update_status/<int:card_id>/", methods=["PUT"])
@json_response
def update_card_status(card_id: int):
    data = request.json
    return cards_handler.update_card_status_by_id(card_id, data["status_id"])


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
