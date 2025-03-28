import React from 'react';
import { FolderOpen, Pencil } from 'lucide-react';
import { Section } from '../../types';

interface Props {
  sections: Section[];
  selectedSection: string | null;
  onSelectSection: (sectionId: string | null) => void;
  onEditSection: (section: Section) => void;
}

function SectionSelector({ sections, selectedSection, onSelectSection, onEditSection }: Props) {
  const selectedSectionData = sections.find(s => s.id === selectedSection);

  return (
    <div className="flex items-center space-x-2">
      <FolderOpen className="h-4 w-4 text-gray-400" />
      <select
        value={selectedSection || ''}
        onChange={(e) => onSelectSection(e.target.value || null)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">All Folders</option>
        {sections.map((section) => (
          <option key={section.id} value={section.id}>
            {section.name}
          </option>
        ))}
      </select>
      {selectedSectionData && (
        <button
          onClick={() => onEditSection(selectedSectionData)}
          className="p-2 text-gray-400 hover:text-gray-500"
          title="Edit folder"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default SectionSelector;