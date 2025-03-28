export interface Entry {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  section_id?: string;
  attachments?: string[];
  private?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Section {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
}