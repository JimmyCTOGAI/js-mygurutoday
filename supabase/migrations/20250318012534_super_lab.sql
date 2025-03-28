/*
  # Add attachments to journal entries

  1. Changes
    - Add attachments column to journal_entries table
*/

ALTER TABLE journal_entries
ADD COLUMN IF NOT EXISTS attachments text[] DEFAULT '{}'::text[];