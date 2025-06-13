-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
USING ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING ((select auth.uid()) = id);

-- Revision sets policies
CREATE POLICY "Users can view their own revision sets"
ON revision_sets FOR SELECT
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their own revision sets"
ON revision_sets FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own revision sets"
ON revision_sets FOR UPDATE
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own revision sets"
ON revision_sets FOR DELETE
USING ((select auth.uid()) = user_id);

-- Documents policies
CREATE POLICY "Users can view their own documents"
ON documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM revision_sets
    WHERE revision_sets.id = documents.revision_set_id
    AND revision_sets.user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can create documents in their revision sets"
ON documents FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM revision_sets
    WHERE revision_sets.id = documents.revision_set_id
    AND revision_sets.user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can update their own documents"
ON documents FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM revision_sets
    WHERE revision_sets.id = documents.revision_set_id
    AND revision_sets.user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can delete their own documents"
ON documents FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM revision_sets
    WHERE revision_sets.id = documents.revision_set_id
    AND revision_sets.user_id = (select auth.uid())
  )
);

-- Document summaries policies
CREATE POLICY "Users can view their own document summaries"
ON document_summaries FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM revision_sets
    WHERE revision_sets.id = document_summaries.revision_set_id
    AND revision_sets.user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can create document summaries in their revision sets"
ON document_summaries FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM revision_sets
    WHERE revision_sets.id = document_summaries.revision_set_id
    AND revision_sets.user_id = (select auth.uid())
  )
);

-- Document flashcards policies
CREATE POLICY "Users can view their own flashcards"
ON document_flashcards FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM revision_sets
    WHERE revision_sets.id = document_flashcards.revision_set_id
    AND revision_sets.user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can create flashcards in their revision sets"
ON document_flashcards FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM revision_sets
    WHERE revision_sets.id = document_flashcards.revision_set_id
    AND revision_sets.user_id = (select auth.uid())
  )
);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
ON subscriptions FOR SELECT
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their own subscriptions"
ON subscriptions FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own subscriptions"
ON subscriptions FOR UPDATE
USING ((select auth.uid()) = user_id);

-- Ensure cascade delete works with RLS
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_revision_set_id_revision_sets_id_fk;
ALTER TABLE documents ADD CONSTRAINT documents_revision_set_id_revision_sets_id_fk 
    FOREIGN KEY (revision_set_id) 
    REFERENCES revision_sets(id) 
    ON DELETE CASCADE;

ALTER TABLE document_summaries DROP CONSTRAINT IF EXISTS document_summaries_revision_set_id_revision_sets_id_fk;
ALTER TABLE document_summaries ADD CONSTRAINT document_summaries_revision_set_id_revision_sets_id_fk 
    FOREIGN KEY (revision_set_id) 
    REFERENCES revision_sets(id) 
    ON DELETE CASCADE;

ALTER TABLE document_flashcards DROP CONSTRAINT IF EXISTS document_flashcards_revision_set_id_revision_sets_id_fk;
ALTER TABLE document_flashcards ADD CONSTRAINT document_flashcards_revision_set_id_revision_sets_id_fk 
    FOREIGN KEY (revision_set_id) 
    REFERENCES revision_sets(id) 
    ON DELETE CASCADE;

-- Force RLS on all tables
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE revision_sets FORCE ROW LEVEL SECURITY;
ALTER TABLE documents FORCE ROW LEVEL SECURITY;
ALTER TABLE document_summaries FORCE ROW LEVEL SECURITY;
ALTER TABLE document_flashcards FORCE ROW LEVEL SECURITY;
ALTER TABLE subscriptions FORCE ROW LEVEL SECURITY;

-- Add default deny policies
CREATE POLICY "Deny all by default" ON users FOR ALL USING (false);
CREATE POLICY "Deny all by default" ON revision_sets FOR ALL USING (false);
CREATE POLICY "Deny all by default" ON documents FOR ALL USING (false);
CREATE POLICY "Deny all by default" ON document_summaries FOR ALL USING (false);
CREATE POLICY "Deny all by default" ON document_flashcards FOR ALL USING (false);
CREATE POLICY "Deny all by default" ON subscriptions FOR ALL USING (false);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_revision_sets_user_id ON revision_sets(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_revision_set_id ON documents(revision_set_id);
CREATE INDEX IF NOT EXISTS idx_document_summaries_revision_set_id ON document_summaries(revision_set_id);
CREATE INDEX IF NOT EXISTS idx_document_flashcards_revision_set_id ON document_flashcards(revision_set_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);