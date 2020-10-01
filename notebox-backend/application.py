from flask import Flask, redirect, render_template, request, session
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import CORS

from config.config import config
from exceptions.ApiException import ApiBadRequestException, ApiUnauthorizedException
from utils.response_utils import json_response, data_json_response, data_json_response_paginated
from validators import validate_email_and_password, validate_passwords, validate_note_json
from db.database import Database

# Configure application
app = Flask('notebox-app', template_folder='../../templates')
config(app)
app.debug = True

# CORS config to allow react requests
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Init SQLite database
db = Database('notebox.db')


# JWT authentication
class User(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id


# method required by the JWT auth
def authenticate(email, password):
    validate_email_and_password(email, password)
    user_map = get_user_by_email_and_pass(email, password)
    user = User(user_map["id"], user_map["email"], user_map["password"])
    set_session_user_id(user_map["id"])
    return user


# method used to get the identity a user
def identity(payload):
    user_id = payload['identity']
    return get_user_object_by_id(user_id)


jwt = JWT(app, authenticate, identity)


############################################


def get_user_object_by_id(user_id):
    rows = db.get_user_by_id(user_id)

    if not rows:
        return json_response(403, "user not found")

    user_map = rows[0]
    return User(user_map["id"], user_map["email"], user_map["password"])


# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():
    """Show portfolio of stocks"""
    user_id = get_session_user_id()

    # if user is already logged than
    if user_id:
        return redirect("/home")

    return get_login_page("")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Get request parameters
        email = request.form.get("email")
        password = request.form.get("password")

        # Validate email and password
        validate_email_and_password(email, password)

        # Validate user
        user = get_user_by_email_and_pass(email, password)

        # Remember which user has logged in
        set_session_user_id(user["id"])

        # Set header session user_id
        return data_json_response(200, authenticate)

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        email = request.form.get("email")
        password = request.form.get("password")

        # Validate username and password
        validate_email_and_password(email, password)

        # Save user to db
        create_user(email, password)

        # Build confirmation message
        message = "User " + email + " registered successfully!"

        # Redirect user to home page
        return get_login_page(message)

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return get_register_page()


@app.route("/auth/check", methods=["GET"])
@jwt_required()
def is_authenticated():
    return json_response(200, "message", "auth ok.")


@app.route("/account", methods=["GET", "POST", "DELETE"])
@jwt_required()
def reset_password():
    """User account administration"""

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        new_password = request.form.get("new-password")
        old_password = request.form.get("old-password")

        # Validate email and password
        validate_passwords(new_password, old_password)

        # Get user from database
        user = get_user_by_id_and_pass(get_session_user_id(), old_password)

        # Update user password
        update_user_password(get_session_user_id(), new_password)

        message = "Account password has been successfully changed!"

        # Redirect user to home page
        return get_account_page(user["email"], message)

    elif request.method == "DELETE":
        user_id = str(current_identity.id)
        db.delete_account(user_id)
        return json_response(200, "Message", "User deleted successfully")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        user = get_user_by_id(get_session_user_id())
        return get_account_page(user["email"], "")


@app.route("/logout")
def logout():
    """Log user out"""
    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/notes", methods=["GET"])
@jwt_required()
def get_notes():
    # get the note using the id of the user
    user_id = str(current_identity.id)

    order = request.args.get("order")
    order_criteria = request.args.get("orderCriteria")
    search_string = request.args.get("str")
    offset = request.args.get("offset")
    limit = request.args.get("limit")
    has_next_page = False

    if search_string:
        # retrieve notes by string
        (notes_result, has_next_page) = db.get_notes_by_matching_string(user_id, search_string, order, order_criteria, offset, limit)

    else:
        # retrieve all notes
        if not limit and not offset:
            notes_result = db.get_notes_by_user_id(user_id)
        elif limit and offset:
            (notes_result, has_next_page) = db.get_notes_by_user_id_paginated(user_id, limit, offset, order,
                                                                              order_criteria)
        else:
            raise ApiBadRequestException("The limit and/or offset values are invalid")

    return data_json_response_paginated(200, notes_result, has_next_page)


@app.route("/notes/<note_id>", methods=["GET", "PATCH", "DELETE"])
@jwt_required()
def get_note(note_id):
    # get the note using the id of the user
    user_id = str(current_identity.id)

    if request.method == 'GET':
        note_result = db.get_note_by_user_id_and_note_id(user_id, note_id)

        if not note_result:
            raise ApiBadRequestException("No note found for the given note_id!")

        return data_json_response(200, note_result)

    elif request.method == 'DELETE':
        db.delete_note(user_id, note_id)

        return json_response(200, "message", "Note deleted successfully!")

    else:
        # get and validate note from request
        note_json = get_request_json()
        validate_note_json(note_json)

        title = note_json["title"]
        content = note_json["content"]
        updated = note_json["last_updated"]

        # persist the note into the database
        db.update_note(user_id, note_id, title, content, updated)

        return json_response(200, "message", "Note updated successfully!")


@app.route("/notes/<note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    # get the note using the id of the user
    user_id = str(current_identity.id)


@app.route("/notes", methods=["PUT"])
@jwt_required()
def create_note():
    user_id = str(current_identity.id)

    # get and validate note from request
    note_json = get_request_json()
    validate_note_json(note_json)

    title = note_json["title"]
    content = note_json["content"]
    created = note_json["created"]

    # persist the note into the database
    db.save_note(user_id, title, content, created)

    return json_response(200, "message", "Note created.")


# Handles internal server error in case the request has no JSON data
def get_request_json():
    try:
        note_json = request.get_json()
    except Exception:
        raise ApiBadRequestException("A JSON payload must be provided")
    return note_json


def get_account_page(email, message):
    return render_template("account.html", email=email, message=message)


def get_login_page(message):
    return render_template("login.html", message=message)


def get_register_page():
    return render_template("register.html")


# Get current user_id from session
def get_session_user_id():
    try:
        session_user_id = session["user_id"]
    except KeyError:
        return None
    return session_user_id


def set_session_user_id(user_id):
    session["user_id"] = user_id


def get_user_by_email_and_pass(email, password):
    rows = db.get_user_by_email(email)

    if not rows:
        raise ApiUnauthorizedException("Email not found")

    # Ensure username exists and password is correct
    if len(rows) != 1 or not check_password_hash(rows[0]["password"], password):
        raise ApiUnauthorizedException("Invalid password")

    return rows[0]


def get_user_by_id_and_pass(user_id, password):
    # Query database for username
    rows = db.get_user_by_id(user_id)

    if not rows:
        ApiUnauthorizedException("Email not found")

    user = rows[0]

    # Ensure username exists and password is correct
    if not check_password_hash(user["password"], password):
        raise ApiUnauthorizedException("Invalid password")

    return user


def get_user_by_id(user_id):
    rows = db.get_user_by_id(user_id)

    if not rows:
        raise ApiUnauthorizedException("Email not found")

    return rows[0]


def create_user(email, password):
    # Query database for username
    rows = db.get_user_by_email(email)

    # Ensure the email address does not already exist
    if rows:
        raise ApiUnauthorizedException("Email is not available")

    # Hash password
    hashed_pwd = generate_password_hash(password)

    # Save user to db
    user = db.save_user(email, hashed_pwd)

    return user


def update_user_password(user_id, new_password):
    # Update db password
    db.update_user_password(user_id, generate_password_hash(new_password))
