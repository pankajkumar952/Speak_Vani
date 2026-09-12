-- Migration V3: Add Transcript Segments and Language support

ALTER TABLE transcripts ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';

CREATE TABLE IF NOT EXISTS transcript_segments (
    id VARCHAR(36) PRIMARY KEY,
    transcript_id VARCHAR(36) NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
    start_time DOUBLE PRECISION NOT NULL,
    end_time DOUBLE PRECISION NOT NULL,
    text TEXT NOT NULL,
    segment_index INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_transcript_segments_transcript_id ON transcript_segments(transcript_id);
