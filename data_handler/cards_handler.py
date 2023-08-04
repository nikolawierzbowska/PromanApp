import connection

@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return cursor.fetchall()
