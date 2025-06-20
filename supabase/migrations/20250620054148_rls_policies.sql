ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT USING (id = (select auth.uid()));

CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (id = (select auth.uid()));

CREATE POLICY "Users can insert their own profile" ON users
FOR INSERT WITH CHECK (id = (select auth.uid()));

-- Revision sets table policies
CREATE POLICY "Users can view their own revision sets" ON revision_sets
FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own revision sets" ON revision_sets
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own revision sets" ON revision_sets
FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own revision sets" ON revision_sets
FOR DELETE USING (user_id = (select auth.uid()));

-- Documents table policies
CREATE POLICY "Users can view their own documents" ON documents
FOR SELECT USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can insert documents in their revision sets" ON documents
FOR INSERT WITH CHECK (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can update their own documents in their revision sets" ON documents
FOR UPDATE USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can delete their own documents in their revision sets" ON documents
FOR DELETE USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

-- Document summaries table policies
CREATE POLICY "Users can view their own summaries" ON document_summaries
FOR SELECT USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can insert summaries in their revision sets" ON document_summaries
FOR INSERT WITH CHECK (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can update their own summaries" ON document_summaries
FOR UPDATE USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can delete their own summaries" ON document_summaries
FOR DELETE USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

-- Document flashcards table policies
CREATE POLICY "Users can view their own flashcards" ON document_flashcards
FOR SELECT USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can insert flashcards in their revision sets" ON document_flashcards
FOR INSERT WITH CHECK (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can update their own flashcards" ON document_flashcards
FOR UPDATE USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can delete their own flashcards" ON document_flashcards
FOR DELETE USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

-- Subscriptions table policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own subscriptions" ON subscriptions
FOR DELETE USING (user_id = (select auth.uid()));

-- Chat message policies
CREATE POLICY "Users can view their own chat messages" ON chat_logs
FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own chat messages" ON chat_logs
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own chat messages" ON chat_logs
FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own chat messages" ON chat_logs
FOR DELETE USING (user_id = (select auth.uid()));