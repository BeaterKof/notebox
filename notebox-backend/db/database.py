import sqlite3
import threading
import re
from sqlite3 import Error
import os.path

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# class used to handle all the database related actions
class Database:

    def __init__(self, db_file):
        try:
            db_path = os.path.join(BASE_DIR, db_file)
            self.connection = sqlite3.connect(db_path, check_same_thread=False)
            self.connection.row_factory = sqlite3.Row
            self.connection.set_trace_callback(print)
            self.cursor = self.connection.cursor()
            print(sqlite3.version)
            print('Location of db: ' + db_path)
            self.lock = threading.RLock()
        except Error as e:
            print(e)

    def query(self, sql, params):
        result = self.cursor.execute(sql, params).fetchall()
        self.connection.commit()
        return [dict(row) for row in result]

    def __del__(self):
        self.connection.close()

    # Database functions
    def get_user_by_email(self, email):
        return self.query("SELECT * FROM user WHERE email=?", (email,))

    def get_user_by_id(self, id):
        return self.query("SELECT * FROM user WHERE id=?", (id,))

    def save_user(self, email, hashed_pwd):
        result = self.query("INSERT INTO user(email, password) VALUES(?, ?)", (email, hashed_pwd))
        print("User: " + email + " created!")
        return result

    def update_user_password(self, user_id, hashed_pwd):
        return self.query("UPDATE user SET password=? WHERE id=?", (hashed_pwd, user_id))

    def get_note_by_id(self, id):
        return self.query("SELECT * FROM note WHERE id=?", (id,))

    def get_note_by_user_id_and_note_id(self, user_id, note_id):
        return self.query("SELECT * FROM note WHERE user_id=? AND id=?", (user_id, note_id))

    def get_notes_by_user_id(self, user_id):
        return self.query("SELECT * FROM note WHERE user_id=?", (user_id,))

    # returns the retrieved data and if the next page of data exists
    def get_notes_by_user_id_paginated(self, user_id, limit, offset, order, order_criteria):
        if not (order == "ASC" or order == "DESC" or order_criteria == "last_updated" or order_criteria == "title"):
            raise Exception("Illegal parameter!" + order + " OR " + order_criteria)

        start_value = int(limit) * int(offset)
        end_value = start_value + int(limit) + 1

        # todo: possible security issue
        data_query_str = "SELECT * FROM note WHERE user_id=? ORDER BY {} {} LIMIT ?, ?" \
            .format(order_criteria, order)

        data_query_result = self.query(data_query_str, (user_id, start_value, end_value,))

        has_next_page = len(data_query_result) > int(limit)
        if has_next_page:
            data_query_result = data_query_result[:-1]

        return data_query_result, has_next_page

    def save_note(self, owner_id, title, content, created):
        self.query("INSERT INTO note(user_id, title, content, created, last_updated) VALUES(?, ?, ?, ?, ?)",
                   (owner_id, title, content, created, created))
        note_id = self.cursor.lastrowid
        self.query("INSERT INTO virtual_note(id, user_id, title, content, created, last_updated) "
                   "VALUES(?, ?, ?, ?, ?, ?)",
                   (note_id, owner_id, title, content, created, created))

    def update_note(self, owner_id, note_id, title, content, updated):
        self.query("UPDATE note SET title=?, content=?, last_updated=? WHERE id=? AND user_id=?",
                   (title, content, updated, note_id, owner_id))
        return self.query("UPDATE virtual_note SET title=?, content=?, last_updated=? WHERE CAST(id AS NUMERIC)=?",
                          (title, content, updated, note_id))

    def delete_note(self, owner_id, note_id):
        self.query("DELETE FROM note WHERE id=? AND user_id=?", (note_id, owner_id,))
        return self.query("DELETE FROM virtual_note WHERE CAST(id AS NUMERIC)=?", (note_id,))

    def delete_account(self, owner_id):
        r1 = self.query("DELETE FROM user WHERE id=?", (owner_id,))
        r2 = self.query("DELETE FROM note WHERE user_id=?", (owner_id,))
        return r1, r2

    def get_notes_by_matching_string(self, user_id, string, order, order_criteria, offset, limit):
        if not (order == "ASC" or order == "DESC" or order_criteria == "last_updated" or order_criteria == "title"):
            raise Exception("Illegal parameter!" + order + " OR " + order_criteria)

        # enable prefix search
        prepared_string = self.__prepare_matching_string(string)

        query_by_string = """(SELECT id, user_id, highlight(virtual_note, 2, '<b>', '</b>') title,
         highlight(virtual_note, 3, '<b>', '</b>') content, last_updated, created
         FROM virtual_note
         WHERE user_id = ?
         AND virtual_note MATCH '{title content} :' || ? )"""

        query = "SELECT t.* from " + query_by_string + " t ORDER BY {} {}".format(order_criteria, order)

        has_next_page = False

        return self.query(query, (user_id, prepared_string,)), has_next_page

    @staticmethod
    def __prepare_matching_string(string):
        # remove any whitespace from beginning and end of the word
        string.strip()

        # remove existing asterisks
        string = string.replace("*", " ")

        # replace consecutive whitespaces with a single whitespace
        string = re.sub(' +', ' ', string)

        # add asterisk (*) at the end of all words in order to enable prefix search (except last word)
        string.replace(" ", "*")

        # add final asterisk
        string = string + "*"

        return string
