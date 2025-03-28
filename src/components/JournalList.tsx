import React from 'react';
import { Calendar, Tag as TagIcon, Edit } from 'lucide-react';
import { Entry } from '../types';

interface Props {
  entries: Entry[];
  onEditEntry: (entry: Entry) => void;
}

function JournalList({ entries, onEditEntry }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No journal entries yet. Start writing!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{entry.title}</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onEditEntry(entry)}
                className="text-gray-400 hover:text-gray-600"
                title="Edit entry"
              >
                <Edit className="h-4 w-4" />
              </button>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                <time dateTime={entry.date}>
                  {new Date(entry.date).toLocaleDateString()}
                </time>
              </div>
            </div>
          </div>
          <div 
            className="text-gray-600 mb-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <TagIcon className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {entry.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default JournalList;