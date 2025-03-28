/*
  # Add sections table and relationships

  1. New Tables
    - `sections`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, nullable)
      - `color` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Changes
    - Add `section_id` column to `journal_entries` table
    - Add foreign key constraint from `journal_entries` to `sections`

  3. Security
    - Enable RLS on `sections` table
    - Add policies for authenticated users to:
      - Read their own sections
      - Create new sections
      - Update their own sections
      - Delete their own sections
*/

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add section_id to journal_entries
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' 
    AND column_name = 'section_id'
  ) THEN
    ALTER TABLE journal_entries 
    ADD COLUMN section_id uuid REFERENCES sections(id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Policies for sections
CREATE POLICY "Users can read own sections"
  ON sections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sections"
  ON sections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sections"
  ON sections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sections"
  ON sections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);