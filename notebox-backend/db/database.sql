
-- create users table
CREATE TABLE IF NOT EXISTS 'user' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    'email' TEXT NOT NULL,
    'password' TEXT NOT NULL
);
CREATE UNIQUE INDEX 'email' ON "user" ("email");

-- create notes table
CREATE TABLE IF NOT EXISTS 'note' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    'user_id' INTEGER NOT NULL,
    'title' TEXT NOT NULL,
    'content' TEXT,
    'created' DATETIME default current_timestamp,
    'last_updated' DATETIME default current_timestamp,
    FOREIGN KEY (user_id) REFERENCES user (id)
);

-- create note virtual table for FTS
CREATE VIRTUAL TABLE virtual_note USING fts5(id, user_id, title, content, created, last_updated);

-- populate virtual table
INSERT INTO virtual_note SELECT id, user_id, title, content, created, last_updated FROM note;

-- TODO create index on last_updated and user_id column