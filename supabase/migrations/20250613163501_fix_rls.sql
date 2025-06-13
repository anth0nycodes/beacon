-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own revision sets" ON revision_sets;
DROP POLICY IF EXISTS "Users can create their own revision sets" ON revision_sets;
DROP POLICY IF EXISTS "Users can update their own revision sets" ON revision_sets;
DROP POLICY IF EXISTS "Users can delete their own revision sets" ON revision_sets;
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;
DROP POLICY IF EXISTS "Users can create documents in their revision sets" ON documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;
DROP POLICY IF EXISTS "Users can view their own document summaries" ON document_summaries;
DROP POLICY IF EXISTS "Users can create document summaries in their revision sets" ON document_summaries;
DROP POLICY IF EXISTS "Users can view their own flashcards" ON document_flashcards;
DROP POLICY IF EXISTS "Users can create flashcards in their revision sets" ON document_flashcards;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can create their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Deny all by default" ON users;
DROP POLICY IF EXISTS "Deny all by default" ON revision_sets;
DROP POLICY IF EXISTS "Deny all by default" ON documents;
DROP POLICY IF EXISTS "Deny all by default" ON document_summaries;
DROP POLICY IF EXISTS "Deny all by default" ON document_flashcards;
DROP POLICY IF EXISTS "Deny all by default" ON subscriptions;

-- Create new simplified policies
-- Users table
CREATE POLICY "Users can only access their own profile" ON users
FOR ALL USING (id = auth.uid());

-- Revision sets table
CREATE POLICY "Users can only access their own revision sets" ON revision_sets
FOR ALL USING (user_id = auth.uid());

-- Documents table
CREATE POLICY "Users can only access their own documents" ON documents
FOR ALL USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = auth.uid()
  )
);

-- Document summaries table
CREATE POLICY "Users can only access their own summaries" ON document_summaries
FOR ALL USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = auth.uid()
  )
);

-- Document flashcards table
CREATE POLICY "Users can only access their own flashcards" ON document_flashcards
FOR ALL USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = auth.uid()
  )
);

-- Subscriptions table
CREATE POLICY "Users can only access their own subscriptions" ON subscriptions
FOR ALL USING (user_id = auth.uid());

-- Keep the performance indexes
CREATE INDEX IF NOT EXISTS idx_revision_sets_user_id ON revision_sets(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_revision_set_id ON documents(revision_set_id);
CREATE INDEX IF NOT EXISTS idx_document_summaries_revision_set_id ON document_summaries(revision_set_id);
CREATE INDEX IF NOT EXISTS idx_document_flashcards_revision_set_id ON document_flashcards(revision_set_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);