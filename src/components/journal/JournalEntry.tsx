import React, { useState, useEffect } from 'react';
import { X, Tag as TagIcon, FolderOpen, Image as ImageIcon, Link as LinkIcon, Paperclip, Trash2, HelpCircle } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Entry, Section } from '../../types';
import { supabase } from '../../lib/supabase';

interface Props {
  onSave: (entry: Entry) => void;
  onCancel: () => void;
  sections: Section[];
  selectedSection: string | null;
  onSelectSection: (sectionId: string | null) => void;
  initialEntry?: Entry | null;
}

function JournalEntry({ onSave, onCancel, sections, selectedSection, onSelectSection, initialEntry }: Props) {
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialEntry?.tags || []);
  const [currentSection, setCurrentSection] = useState<string | null>(initialEntry?.section_id || selectedSection);
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState<string[]>(initialEntry?.attachments || []);
  const [isPrivate, setIsPrivate] = useState(initialEntry?.private || false);
  const [showPrivateTooltip, setShowPrivateTooltip] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
    ],
    content: initialEntry?.content || '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] px-4 py-2',
      },
    },
  });

  useEffect(() => {
    if (initialEntry && editor) {
      editor.commands.setContent(initialEntry.content);
    }
  }, [initialEntry, editor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !editor?.getText().trim()) return;

    onSave({
      id: initialEntry?.id || Date.now().toString(),
      title: title.trim(),
      content: editor.getHTML(),
      date: initialEntry?.date || new Date().toISOString(),
      tags,
      section_id: currentSection,
      attachments,
      private: isPrivate
    });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSectionChange = (sectionId: string) => {
    const newSectionId = sectionId || null;
    setCurrentSection(newSectionId);
    onSelectSection(newSectionId);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      setUploading(true);
      const newAttachments: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `journal-attachments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('journal-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('journal-files')
          .getPublicUrl(filePath);

        newAttachments.push(publicUrl);
      }

      setAttachments([...attachments, ...newAttachments]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `journal-attachments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('journal-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('journal-files')
          .getPublicUrl(filePath);

        editor?.chain().focus().setImage({ src: publicUrl }).run();
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  const handleAddLink = () => {
    const url = window.prompt('Enter the URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeAttachment = (urlToRemove: string) => {
    setAttachments(attachments.filter(url => url !== urlToRemove));
  };

  const getFileNameFromUrl = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {initialEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <FolderOpen className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <select
            value={currentSection || ''}
            onChange={(e) => handleSectionChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="">Choose a Folder</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <div className="border-b border-gray-300 px-3 py-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1 rounded ${editor?.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1 rounded ${editor?.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded ${editor?.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              •
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded ${editor?.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              1.
            </button>
            <button
              type="button"
              onClick={handleAddLink}
              className={`p-1 rounded ${editor?.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleImageUpload}
              className="p-1 rounded hover:bg-gray-100"
              disabled={uploading}
            >
              <ImageIcon className="h-4 w-4" />
            </button>
          </div>
          <EditorContent editor={editor} className="min-h-[300px]" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <TagIcon className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-md bg-gray-50">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 inline-flex items-center justify-center text-indigo-400 hover:text-indigo-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Attach Files
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
          </div>
          {attachments.length > 0 && (
            <div className="space-y-2 p-3 border border-gray-200 rounded-md bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700">Attachments</h3>
              <div className="divide-y divide-gray-200">
                {attachments.map((url, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 truncate"
                    >
                      {getFileNameFromUrl(url)}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeAttachment(url)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 py-2">
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              id="private-entry"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="private-entry" className="ml-2 text-sm text-gray-700 flex items-center">
              Click here to mark this entry private
              <button
                type="button"
                className="ml-1 text-gray-400 hover:text-gray-600"
                onMouseEnter={() => setShowPrivateTooltip(true)}
                onMouseLeave={() => setShowPrivateTooltip(false)}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </label>
            {showPrivateTooltip && (
              <div className="absolute bottom-full left-0 mb-2 w-72 bg-gray-900 text-white text-sm rounded-lg p-2 shadow-lg">
                Private entries are only visible to you and won't appear in shared views or exports of your journal. Even your Guruuz won't be able to access these entries.
                <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : (initialEntry ? 'Save Changes' : 'Save Entry')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default JournalEntry;