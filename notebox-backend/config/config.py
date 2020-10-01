import logging
from datetime import timedelta
from tempfile import mkdtemp
from flask_session import Session
from exceptions.exception_handler import default_exception_handler


def config(app):
    # Ensure templates are auto-reloaded
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    app.config["PROPAGATE_EXCEPTIONS"] = True

    # Configure session to use filesystem (instead of signed cookies)
    app.config["SESSION_FILE_DIR"] = mkdtemp()
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    Session(app)

    # Configure logger
    app.logger.setLevel(logging.INFO)

    # Set default internal error handler
    app.errorhandler(Exception)(default_exception_handler)

    # Configure secret key used for JWT auth
    app.config['SECRET_KEY'] = 'super-secret'

    # JWT expiration time
    app.config['JWT_EXPIRATION_DELTA'] = timedelta(seconds=1800)
