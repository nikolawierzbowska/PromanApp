import connection

@connection.connection_handler
def get_boards(cursor):
    cursor.execute(
        """
        SELECT * FROM boards
        where user_id is null
        ;
        """)
    return cursor.fetchall()


@connection.connection_handler
def get_boards_private(cursor, user_id):
    cursor.execute(
        """
        SELECT * FROM boards
        WHERE  user_id =%(user_id)s;
        """, {"user_id": user_id})

    return cursor.fetchall()






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
    new_board_id = cursor.fetchone()["id"]


    cursor.execute(
        """
        INSERT INTO board_status(board_id, status_id, status_title)
        SELECT %(board_id)s, statuses.id, statuses.title
        from boards
        cross join statuses
        WHERE boards.id = %(board_id)s
        AND statuses.column_rec='1';
            
        """, {"board_id": new_board_id})


@connection.connection_handler
def add_board_private(cursor, user_id, title):
    cursor.execute(
        """
        INSERT INTO boards(user_id, title)
        VALUES (%(user_id)s, %(title)s)
        RETURNING id;

        """, {"user_id" :user_id,
            "title": title})
    new_board_id = cursor.fetchone()["id"]

    cursor.execute(
        """
        INSERT INTO board_status(board_id, status_id, status_title)
        SELECT %(board_id)s, statuses.id, statuses.title
        from boards
        cross join statuses
        WHERE boards.id = %(board_id)s
        AND statuses.column_rec='1';

        """, {"board_id": new_board_id})


@connection.connection_handler
def delete_board_by_id(cursor, board_id):
    cursor.execute(
        """
        DELETE FROM boards
        WHERE id = %(board_id)s
        """, {"board_id": board_id})

    cursor.execute(
        """
        DELETE FROM statuses
        WHERE column_rec = 0
        AND id NOT IN (
            SELECT status_id
            FROM board_status)

        """)




@connection.connection_handler
def update_board_by_id(cursor, board_id, title):
    cursor.execute(
        """
        UPDATE boards
        SET title = %(title)s
        WHERE id = %(board_id)s;
        """, {"title": title,
            "board_id": board_id})


