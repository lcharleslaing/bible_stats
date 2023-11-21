CREATE TABLE transcripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id TEXT NOT NULL,
    start REAL NOT NULL,
    duration REAL NOT NULL,
    text TEXT NOT NULL
);
