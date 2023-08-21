import connection

@connection.connection_handler
def get_boards(cursor):
    cursor.execute(
        """
        SELECT * FROM boards
        ;
        """)
    return cursor.fetchall()


# @connection.connection_handler
# def get_boards(cursor):
#     cursor.execute(
#         """
#         SELECT boards.id, boards.title, board_status.status_title
#         from boards
#         full join board_status
#         on boards.id = board_status.board_id
#         ;
#         """)
#     return cursor.fetchall()





@connection.connection_handler
def get_board(cursor, board_id):
    cursor.execute(
        """
        SELECT * FROM boards
        WHERE id = %(id)s;
        """, {"id": board_id})
    return cursor.fetchone()



@connection.connection_handler
def add_board(cursor, title):
    cursor.execute(
        """
        INSERT INTO boards(title)
        VALUES (%(title)s)
        RETURNING id;    
        """, {"title": title})


    return cursor.fetchone()["id"]


@connection.connection_handler
def delete_board_by_id(cursor, board_id):
    cursor.execute(
        """
        DELETE FROM boards
        WHERE id = %(board_id)s
        """, {"board_id": board_id})


@connection.connection_handler
def update_board_by_id(cursor, board_id, title):
    cursor.execute(
        """
        UPDATE boards
        SET title = %(title)s
        WHERE id = %(board_id)s;
        """, {"title": title,
            "board_id": board_id})


