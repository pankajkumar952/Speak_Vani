-- V6: Enhance speech coaching schema with rich deterministic metrics and LLM coaching metadata

ALTER TABLE speech_analysis
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'COMPLETED',
    ADD COLUMN IF NOT EXISTS character_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS sentence_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS argument_score DOUBLE PRECISION DEFAULT 0.0,
    ADD COLUMN IF NOT EXISTS conciseness_score DOUBLE PRECISION DEFAULT 0.0,
    ADD COLUMN IF NOT EXISTS filler_words_json TEXT,
    ADD COLUMN IF NOT EXISTS better_phrases_json TEXT,
    ADD COLUMN IF NOT EXISTS coach_summary TEXT,
    ADD COLUMN IF NOT EXISTS follow_up_challenge TEXT,
    ADD COLUMN IF NOT EXISTS provider VARCHAR(100) DEFAULT 'groq-whisper',
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE transcripts
    ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'english',
    ADD COLUMN IF NOT EXISTS provider VARCHAR(100) DEFAULT 'groq-whisper',
    ADD COLUMN IF NOT EXISTS segments_json TEXT;

CREATE INDEX IF NOT EXISTS idx_speech_analysis_session_id ON speech_analysis(session_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_session_id ON transcripts(session_id);
