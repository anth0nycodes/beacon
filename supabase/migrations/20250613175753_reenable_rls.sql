-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT USING (id = (select auth.uid()));

CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (id = (select auth.uid()));

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

CREATE POLICY "Users can update their own documents" ON documents
FOR UPDATE USING (
  revision_set_id IN (
    SELECT id FROM revision_sets WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can delete their own documents" ON documents
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