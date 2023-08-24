import connection

@connection.connection_handler
def get_status_for_board_id(cursor, board_id):
    cursor.execute(
        """
        SELECT statuses.id, statuses.title, statuses.column_rec, statuses.order_status, board_status.status_title
    
        FROM statuses
        full join board_status on statuses.id = board_status.status_id
        WHERE board_status.board_id = %(board_id)s
        order by order_status;
        
        """
        , {"board_id": board_id})
    return cursor.fetchall()


@connection.connection_handler
def get_statuses(cursor):
    cursor.execute(
        """
        SELECT * FROM statuses
    
        """)
    return cursor.fetchall()


@connection.connection_handler
def add_status(cursor, board_id, title):
    cursor.execute(
        """
        INSERT INTO statuses(title, column_rec, order_status)
        VALUES (%(title)s, 0, 1 );    
        """, {"board_id":board_id,
            "title": title})

    cursor.execute(
        """
        INSERT INTO board_status(board_id, status_id, status_title)
        SELECT boards.id, statuses.id, statuses.title
        from boards
        join statuses on statuses.title = %(title)s
        WHERE boards.id = %(board_id)s;
            
        """, {"board_id":board_id,
            "title": title})










@connection.connection_handler
def update_status(cursor, board_id, status_id, title ):
    cursor.execute(
    """
        UPDATE board_status
        SET status_title = %(title)s
        WHERE board_id = %(board_id)s
        AND status_id = %(status_id)s
        """, {"board_id":board_id,
              "title" :title,
                "status_id":status_id})