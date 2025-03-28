/*
  # Add sections support
  
  1. New Tables
    - `sections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `description` (text)
      - `color` (text)
      - `created_at` (timestamp)

  2. Changes
    - Add `section_id` to `journal_entries` table
    
  3. Security
    - Enable RLS on `sections` table
    - Add policies for authenticated users to manage their sections
*/

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  color text NOT NULL DEFAULT '#6366F1',
  created_at timestamptz DEFAULT now()
);

-- Add section_id to journal_entries
ALTER TABLE journal_entries 
ADD COLUMN section_id uuid REFERENCES sections(id);

-- Enable RLS
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Policies for sections
CREATE POLICY "Users can create sections"
  ON sections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own sections"
  ON sections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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