
### environment
export FLASK_APP=application.py

### run with
flask run --host=localhost

### Functionality:
- FlaskJWT for authentication
- text search is done via Sqlite FTS5. 
The notes will be searched by suffixes or full words. (https://www.sqlite.org/fts5.html)
