/*
  # Add storage bucket for journal files

  1. Changes
    - Create a new storage bucket called 'journal-files' for storing uploaded documents
    - Enable public access to the bucket
    - Add storage policies for authenticated users

  2. Security
    - Enable RLS on the bucket
    - Add policies for authenticated users to:
      - Upload files
      - Read their own files
*/

-- Create a new storage bucket for journal files
insert into storage.buckets (id, name, public)
values ('journal-files', 'journal-files', true);

-- Enable RLS
create policy "Authenticated users can upload files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'journal-files');

create policy "Authenticated users can read files"
on storage.objects for select
to authenticated
using (bucket_id = 'journal-files');