import logging
from werkzeug.exceptions import HTTPException, InternalServerError
from exceptions.ApiException import ApiException
from utils.response_utils import error_json_response, to_error_map, errors_json_response


def default_exception_handler(e):
    logger = logging.getLogger('notebox-app')

    """Handle default HTTPException"""
    if isinstance(e, HTTPException):
        log_exception_description(logger, e)
        return error_json_response(e.code, e.description)

    """Handle customised HTTPException"""
    if isinstance(e, ApiException):
        if isinstance(e.message, list):
            log_exception_description(logger, e)
            return errors_json_response(e.code, e.message)
        log_exception_description(logger, e)
        return error_json_response(e.code, to_error_map(e.message, e.description))

    """Handle internal server error"""
    logger.exception(e)
    e = InternalServerError()
    return error_json_response(e.code, e.description)


def log_exception_description(logger, e):
    logger.info("Request rejected with message -> " + e.description)
