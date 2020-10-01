from werkzeug.exceptions import Unauthorized, InternalServerError, BadRequest, Forbidden


class ApiException(Exception):

    http_exception = None
    message = None

    def __init__(self, http_exception=None, message=None):
        Exception.__init__(self)
        self.http_exception = http_exception
        self.message = message

    @property
    def code(self):
        return self.http_exception.code

    @property
    def description(self):
        return self.http_exception.description


class ApiBadRequestException(ApiException):

    def __init__(self, message):
        ApiException.__init__(self, BadRequest(), message)


class ApiForbiddenException(ApiException):

    def __init__(self, message):
        ApiException.__init__(self, Forbidden(), message)


class ApiUnauthorizedException(ApiException):

    def __init__(self, message):
        ApiException.__init__(self, Unauthorized(), message)
