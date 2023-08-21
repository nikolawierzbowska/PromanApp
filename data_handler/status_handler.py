import connection

@connection.connection_handler
def get_card_status_for_board_id(cursor, board_id):
    cursor.execute(
        """
        SELECT statuses.id, statuses.title
        FROM statuses
        full join board_status on statuses.id = board_status.status_id
        WHERE board_status.board_id = %(board_id)s;
        """
        , {"board_id": board_id})
    return cursor.fetchall()


@connection.connection_handler
def get_statuses(cursor):
    cursor.execute(
        """
        SELECT * FROM statuses;
        """)
    return cursor.fetchall()


@connection.connection_handler
def add_status(cursor, board_id, title):
    cursor.execute(
        """
        INSERT INTO statuses(title)
        VALUES (%(title)s);    
        """, {"board_id":board_id,
            "title": title})



@connection.connection_handler
def update_status(cursor, board_id, title ):
    cursor.execute(
        """
        UPDATE statuses
        SET title = %(title)s
        WHERE board_id = %(board_id)s
        """, {"board_id":board_id,
              "title" :title})