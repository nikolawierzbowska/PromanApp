import connection

@connection.connection_handler
def get_boards(cursor):
    cursor.execute(
        """
        SELECT * FROM boards
        ;
        """)
    return cursor.fetchall()
