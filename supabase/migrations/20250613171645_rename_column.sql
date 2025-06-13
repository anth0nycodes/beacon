-- First, drop all contents from both tables
TRUNCATE TABLE documents CASCADE;
TRUNCATE TABLE revision_sets CASCADE;

-- Then rename the column from file_hash to key
ALTER TABLE documents RENAME COLUMN file_hash TO key;