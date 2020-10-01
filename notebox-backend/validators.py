from exceptions.ApiException import ApiBadRequestException, ApiForbiddenException, ApiUnauthorizedException
from utils.response_utils import to_error_map


# validates email and password of a user
def validate_email_and_password(email, password):

    # Ensure username was submitted
    if not email:
        raise ApiUnauthorizedException("An email address must be provided")

    # Ensure username length is valid
    elif len(email) < 5 or len(email) > 254:
        raise ApiUnauthorizedException("A valid length email address must be provided (5-256 chars) ")

    return validate_password(password)


# validate two passwords
def validate_passwords(old_password, new_password):

    validate_password(old_password)
    validate_password(new_password)


# validate password
def validate_password(password):

    # Ensure password was submitted
    if not password:
        raise ApiForbiddenException("An password must be provided")

    # Ensure password length is valid
    elif len(password) < 5 or len(password) > 254:
        raise ApiForbiddenException("A valid length password must be provided")


# validate a note json
def validate_note_json(note_json):

    if not note_json:
        raise ApiBadRequestException("A JSON payload containing the note details must be provided")

    title = note_json.get("title")

    errors = []

    if not title:
        errors.append(to_error_map("Title is missing", "A note must contain a title"))
    elif len(title) > 254:
        errors.append(to_error_map("Title is too long", "Title should have size smaller than 254 characters"))

    if errors:
        raise ApiBadRequestException(errors)
