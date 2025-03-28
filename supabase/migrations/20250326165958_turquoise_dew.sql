/*
  # Add private field to journal entries

  1. Changes
    - Add private boolean column to journal_entries table with default value of false
*/

ALTER TABLE journal_entries
ADD COLUMN IF NOT EXISTS private boolean DEFAULT false;