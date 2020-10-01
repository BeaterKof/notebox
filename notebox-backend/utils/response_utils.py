
def error_json_response(status_code, payload):
    return json_response(status_code, "error", payload)


def errors_json_response(status_code, payload):
    return json_response(status_code, "errors", payload)


def data_json_response(status_code, payload):
    return json_response(status_code, "data", payload)


def data_json_response_paginated(status_code, payload, has_next_page):
    return json_response_paginated(status_code, "data", payload, "hasNextPage", has_next_page)


def json_response(status_code, payload_tag, payload):
    json = {'status': str(status_code), payload_tag: payload}
    return json, status_code


def json_response_paginated(status_code, payload_tag, payload, next_page_tag, has_next_page):
    json = {'status': str(status_code), payload_tag: payload, next_page_tag: has_next_page}
    return json, status_code


# message represents the error message
# details should contain the requirements for the resource that threw the error
def to_error_map(message, details):
    return {'details': details, 'message': message}