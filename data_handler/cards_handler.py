import connection

@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        AND archive is false
      
        ;
        """
        , {"board_id": board_id})

    return cursor.fetchall()


@connection.connection_handler
def get_card_by_id(cursor, card_id):
    cursor.execute("""
        SELECT * 
        FROM cards
        WHERE id = %(card_id)s;
        """, {"card_id": card_id})
    return cursor.fetchone()


@connection.connection_handler
def add_card(cursor, board_id, status_id, title):
    cursor.execute(
        """
        INSERT INTO cards(board_id, status_id, title, archive)
        VALUES (%(board_id)s, %(status_id)s , %(title)s, false);    
        """, {"board_id":board_id,
              "status_id":status_id,
              "title": title})

@connection.connection_handler
def delete_card_by_id(cursor, card_id):
    cursor.execute(
        """
        DELETE FROM cards 
        WHERE id = %(card_id)s;
        """, {"card_id": card_id})


@connection.connection_handler
def update_card_title_by_id(cursor, card_id, title):
    cursor.execute(
        """
        UPDATE cards
        SET title = %(title)s
        WHERE id = %(card_id)s;
        """, {"title": title,
            "card_id": card_id})


@connection.connection_handler
def update_card_order_by_id(cursor, card_id, card_order):
    cursor.execute(
        """
        UPDATE cards
        SET card_order = %(card_order)s
        WHERE id = %(card_id)s;
        """, {"card_order": card_order,
            "card_id": card_id})


@connection.connection_handler
def update_card_status_by_id(cursor, card_id, status_id):
    cursor.execute(
        """
        UPDATE cards
        SET status_id = %(status_id)s
        WHERE id = %(card_id)s;
        """, {"status_id": status_id,
            "card_id": card_id})


@connection.connection_handler
def update_card_archive_by_id(cursor, card_id, archive):
    cursor.execute(
        """
        UPDATE cards
        SET archive= %(archive)s
        WHERE id = %(card_id)s;
        """, {"archive": archive,
            "card_id": card_id})


@connection.connection_handler
def get_cards_archived(cursor, board_id):
    cursor.execute("""
        SELECT * 
        FROM cards
        WHERE archive is true 
        and board_id = %(board_id)s;
        """, {"board_id" :board_id})
    return cursor.fetchall()

