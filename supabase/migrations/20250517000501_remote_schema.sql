-- Create custom types first
CREATE TYPE content_type AS ENUM (
    'pdf',
    'docx',
    'text',
    'url',
    'youtube'
);

CREATE TYPE processing_status AS ENUM (
    'processing',
    'ready',
    'error'
);

-- Create study_sets table
-- This is our main table that represents a study resource
CREATE TABLE study_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Automatically generate UUIDs
    user_id UUID REFERENCES auth.users NOT NULL,   -- Link to Supabase auth user
    title TEXT NOT NULL,
    description TEXT,                              -- Optional description
    content_type content_type NOT NULL,
    status processing_status NOT NULL DEFAULT 'processing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create documents table
-- Stores the actual content and processed data
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_set_id UUID REFERENCES study_sets ON DELETE CASCADE NOT NULL,
    storage_path TEXT,                            -- Path in Supabase storage
    original_filename TEXT,
    file_size BIGINT,
    processed_content TEXT,                       -- Extracted/processed content
    content_structure JSONB,                      -- Structured format of content
    important_terms JSONB[],                      -- Array of key terms/concepts
    last_processed_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB,                               -- Flexible metadata storage
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create flashcards table
-- Stores AI-generated flashcards
CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_set_id UUID REFERENCES study_sets ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    confidence_score FLOAT,                       -- AI confidence in the card
    last_reviewed TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_study_sets_user_id ON study_sets(user_id);
CREATE INDEX idx_study_sets_created_at ON study_sets(created_at);
CREATE INDEX idx_documents_study_set_id ON documents(study_set_id);
CREATE INDEX idx_flashcards_study_set_id ON flashcards(study_set_id);

-- Enable Row Level Security (RLS)
-- This ensures users can only access their own data
ALTER TABLE study_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own study sets"
    ON study_sets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study sets"
    ON study_sets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sets"
    ON study_sets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sets"
    ON study_sets FOR DELETE
    USING (auth.uid() = user_id);

-- Documents inherit permissions from study_sets through the foreign key
CREATE POLICY "Users can view their own documents"
    ON documents FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM study_sets
        WHERE study_sets.id = documents.study_set_id
        AND study_sets.user_id = auth.uid()
    ));

-- Flashcards inherit permissions from study_sets through the foreign key
CREATE POLICY "Users can view their own flashcards"
    ON flashcards FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM study_sets
        WHERE study_sets.id = flashcards.study_set_id
        AND study_sets.user_id = auth.uid()
    )); 