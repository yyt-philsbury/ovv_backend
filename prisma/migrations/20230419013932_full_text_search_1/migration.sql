CREATE VIRTUAL TABLE video_search
USING FTS5(id, title, author, original_upload_year);