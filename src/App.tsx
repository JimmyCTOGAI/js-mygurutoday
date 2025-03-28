import React, { useState, useEffect, useCallback, memo } from 'react';
import { PlusCircle, Calendar, Search, Tag as TagIcon, FolderPlus, Filter } from 'lucide-react';
import { FiMessageSquare, FiSearch, FiMenu } from 'react-icons/fi';
import JournalEntry from './components/journal/JournalEntry';
import JournalList from './components/journal/JournalList';
import SectionSelector from './components/journal/SectionSelector';
import CreateSection from './components/journal/CreateSection';
import EditSection from './components/journal/EditSection';
import Auth from './components/Auth';
import { SidebarToggle } from './components/SidebarToggle';
import { ChatAvatar } from './components/ChatAvatar';
import { UserMenu } from './components/UserMenu';
import { NotificationsMenu } from './components/NotificationsMenu';
import { MissionControl } from './components/MissionControl';
import { CharacterIcons } from './components/CharacterIcons';
import { Entry, Section } from './types';
import { supabase } from './lib/supabase';

const LOGO_URL = 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/icons/Hi%20Res%20MyGuruu%20Wordmark.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pY29ucy9IaSBSZXMgTXlHdXJ1dSBXb3JkbWFyay5wbmciLCJpYXQiOjE3NDI4MzY3NDQsImV4cCI6MjA1ODE5Njc0NH0.aokIBPpF-8vyC9TwWNrbH9Oq1aCzaNMw7wM7WIjlX4A';
const BLACK_WHITE_ICON_URL = 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/icons/Black%20&%20White%20Icon.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pY29ucy9CbGFjayAmIFdoaXRlIEljb24ucG5nIiwiaWF0IjoxNzQyODM0MzMyLCJleHAiOjIwNTgxOTQzMzJ9.wPqmH6tWUe-N18zD8VSsiac5O8Zsa8Nh2zZpxIRO0a4';
const SCROLL_ARROWS = 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/icons/Scroll%20Down%20Arrows.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pY29ucy9TY3JvbGwgRG93biBBcnJvd3MucG5nIiwiaWF0IjoxNzQyODM0NTc0LCJleHAiOjE3NDM2OTg1NzR9.Bmur3vr81IfacyGJWoYOZqXGX1XIGmH9wg7DUNqaRn4';
const VOICE_PLAYBACK_ICON = 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/icons/Voice%20Playback%20Icon.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pY29ucy9Wb2ljZSBQbGF5YmFjayBJY29uLnBuZyIsImlhdCI6MTc0MjgzNTIxMywiZXhwIjoyMDU4MTk1MjEzfQ.SFI5GP40QCreISpUUVvbs9fOoSRjB6NBKx3WgWOlQLk';

interface Character {
  id: string;
  name: string;
  image: string;
  fullImage: string;
  role: string;
  greeting: string;
  question: string;
  description: string;
}

const Header = memo(function Header({
  userAvatar,
  onAvatarUpdate,
  menuOpen,
  setMenuOpen,
  selectedCharacter
}: {
  userAvatar: string;
  onAvatarUpdate: (url: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  selectedCharacter: Character;
}) {
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center space-x-4">
            <div className="w-48 h-48 flex items-center justify-center">
              <img 
                src={selectedCharacter.fullImage} 
                alt={selectedCharacter.name} 
                className="h-full w-full object-contain" 
                loading="lazy"
              />
            </div>
            <div className="flex flex-col">
              <div className="h-8">
                <img 
                  src={LOGO_URL} 
                  alt="MyGuruu" 
                  className="h-full object-contain"
                  loading="lazy"
                />
              </div>
              <h1 className="text-xl font-semibold text-blue-900 -mt-1">
                {selectedCharacter.role}
              </h1>
              <div className="flex items-center space-x-2 -mt-1">
                <span className="text-gray-600">Goal Summary:</span>
                <span className="text-blue-700 font-medium">
                  {selectedCharacter.description}
                </span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <img 
                    src={BLACK_WHITE_ICON_URL}
                    alt="Upload"
                    className="h-12 w-12"
                    loading="lazy"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <NotificationsMenu />
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle menu"
          >
            <FiMenu className="h-6 w-6 text-gray-600" />
          </button>
          <UserMenu 
            userAvatar={userAvatar}
            onAvatarUpdate={onAvatarUpdate}
          />
        </div>
      </div>
    </header>
  );
});

const ChatMessage = memo(function ChatMessage({ selectedCharacter }: { selectedCharacter: Character }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-start space-x-4">
        <ChatAvatar imageUrl={BLACK_WHITE_ICON_URL} alt="AI Avatar" />
        <div className="flex-1">
          <p className="text-gray-800">{selectedCharacter.greeting}</p>
          <p className="text-gray-800">{selectedCharacter.question}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex-1 flex justify-center">
              <img 
                src={SCROLL_ARROWS} 
                alt="Scroll Down" 
                className="w-8 h-8 animate-bounce"
                loading="lazy"
              />
            </div>
            <img 
              src={VOICE_PLAYBACK_ICON} 
              alt="Voice Playback" 
              className="w-8 h-8 cursor-pointer"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState(BLACK_WHITE_ICON_URL);
  const [message, setMessage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>({
    id: 'oz',
    name: 'Oz',
    image: 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/logo/Guruu%20Oz%20Head.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9sb2dvL0d1cnV1IE96IEhlYWQucG5nIiwiaWF0IjoxNzQzMDA3NTMxLCJleHAiOjIwNTgzNjc1MzF9.hqhIuruPF-rn9O7Iz0CDH1F9t6t_Od7PntuoUchBCi0',
    fullImage: 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/characters/Oz.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jaGFyYWN0ZXJzL096LnBuZyIsImlhdCI6MTc0MzExNjg1MywiZXhwIjoyMDU4NDc2ODUzfQ.8X5hMLGwC7Ur0YgX8pGWNu_zJ7mCYkTkKE6k8QQxHtE',
    role: 'MY BIG BUSINESS > Business Development',
    greeting: "Hey Steve, It's good to see you again, I'm glad you are back.",
    question: "Have you been out playing golf today?",
    description: "Develop the World's Best AI Generated Mentorship Program"
  });

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleMessageSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessage('');
  }, [message]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEntries();
      fetchSections();
    }
  }, [isAuthenticated, selectedSection, startDate, endDate]);

  const resetToHome = () => {
    setIsWriting(false);
    setEditingEntry(null);
    setIsCreatingSection(false);
    setEditingSection(null);
    setSearchTerm('');
    setSelectedTag('');
    setSelectedSection(null);
    setStartDate('');
    setEndDate('');
    setShowFilters(false);
    fetchEntries();
  };

  async function checkAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSections() {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('name');

      if (error) throw error;

      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      setError('Failed to load folders');
    }
  }

  async function fetchEntries() {
    try {
      let query = supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedSection) {
        query = query.eq('section_id', selectedSection);
      }

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        query = query.lt('created_at', nextDay.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      setEntries(data.map(entry => ({
        id: entry.id,
        title: entry.title,
        content: entry.content,
        date: entry.created_at,
        tags: entry.tags || [],
        section_id: entry.section_id,
        attachments: entry.attachments || [],
        private: entry.private || false
      })));
      setError(null);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setError('Failed to load entries');
    }
  }

  const addEntry = async (entry: Entry) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('journal_entries')
        .insert([{
          title: entry.title,
          content: entry.content,
          tags: entry.tags,
          section_id: entry.section_id,
          user_id: user.id,
          attachments: entry.attachments,
          private: entry.private
        }]);

      if (error) throw error;

      await fetchEntries();
      setIsWriting(false);
    } catch (error) {
      console.error('Error adding entry:', error);
      setError('Failed to add entry');
    }
  };

  const updateEntry = async (entry: Entry) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .update({
          title: entry.title,
          content: entry.content,
          tags: entry.tags,
          section_id: entry.section_id,
          attachments: entry.attachments,
          private: entry.private
        })
        .eq('id', entry.id);

      if (error) throw error;

      await fetchEntries();
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating entry:', error);
      setError('Failed to update entry');
    }
  };

  const addSection = async (section: Omit<Section, 'id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('sections')
        .insert([{
          ...section,
          user_id: user.id
        }]);

      if (error) throw error;

      await fetchSections();
      setIsCreatingSection(false);
    } catch (error) {
      console.error('Error adding folder:', error);
      setError('Failed to add folder');
    }
  };

  const updateSection = async (id: string, updates: Partial<Section>) => {
    try {
      const { error } = await supabase
        .from('sections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchSections();
      setEditingSection(null);
    } catch (error) {
      console.error('Error updating folder:', error);
      setError('Failed to update folder');
    }
  };

  const deleteSection = async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ section_id: null })
        .eq('section_id', id);

      if (updateError) throw updateError;

      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (selectedSection === id) {
        setSelectedSection(null);
      }

      await Promise.all([fetchSections(), fetchEntries()]);
      setEditingSection(null);
    } catch (error) {
      console.error('Error deleting folder:', error);
      setError('Failed to delete folder');
    }
  };

  const allTags = Array.from(
    new Set(entries.flatMap(entry => entry.tags))
  ).sort();

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = !selectedTag || entry.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onSignIn={() => setIsAuthenticated(true)} />;
  }

  const date = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    year: "numeric",
  });
  
  const parts = formatter.formatToParts(date);
  const weekday = parts.find(part => part.type === "weekday")?.value;
  const month = parts.find(part => part.type === "month")?.value;
  const year = parts.find(part => part.type === "year")?.value;
  
  const formattedDate = `${weekday}, ${month} ${year}`;

  return (
    <div className="container mx-auto">
      <div className="flex h-screen bg-gray-100">
        <aside className={`sidebar ${sidebarOpen ? '' : 'hidden'}`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleSidebarToggle}
                  className="p-1 hover:bg-gray-200 rounded-full"
                  aria-label="Toggle sidebar"
                >
                  <SidebarToggle className="h-6 w-6 text-gray-600" />
                </button>
                <button 
                  className="p-1 hover:bg-gray-200 rounded-full"
                  aria-label="Search"
                >
                  <FiSearch className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            <CharacterIcons onCharacterSelect={setSelectedCharacter} />

            <div className="flex-1 overflow-y-auto">
              <MissionControl />
            </div>
          </div>
        </aside>

        <main className="main-content flex-1">
          <Header 
            userAvatar={userAvatar}
            onAvatarUpdate={setUserAvatar}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            selectedCharacter={selectedCharacter}
          />

          <div className="p-6">
            <ChatMessage selectedCharacter={selectedCharacter} />

            <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
              <form onSubmit={handleMessageSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  aria-label="Message input"
                />
                <button 
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={!message.trim()}
                  aria-label="Send message"
                >
                  <FiMessageSquare />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
      
      <div className="bg-white cls-secondpart">
        <div className="flex bg-gray-100">
          <aside className={`sidebar ${sidebarOpen ? '' : 'hidden'}`}>
            <div className="flex flex-col">
              <h2 className="px-4">{formattedDate}</h2>
              <img src='calender.jpg' className="w-75 px-4" alt="Calendar" />
            </div>
          </aside>

          <div className="main-content flex-1">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={resetToHome}
                  className="flex items-center space-x-2 hover:opacity-75 transition-opacity focus:outline-none"
                >
                  <img 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAwIDEwMDAiPjxwYXRoIGZpbGw9IiM2MzY2RjEiIGQ9Ik0yMDAgMTAwaDYwMHY4MDBIMjAwVjEwMHoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTAwIDEwMGg1MHY4MDBIMTAwVjEwMHoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTAwIDIwMGgyNXYxMDBoLTI1VjIwMHpNMTAwIDQwMGgyNXYxMDBoLTI1VjQwMHpNMTAwIDYwMGgyNXYxMDBoLTI1VjYwMHpNMTAwIDgwMGgyNXYxMDBoLTI1VjgwMHoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNzAwIDIwMGgxMDB2NTBINzAwVjIwMHpNNzAwIDQwMGgxMDB2NTBINzAwVjQwMHoiLz48L3N2Zz4=" 
                    alt="Journal Logo"
                    className="h-6 w-6 text-indigo-600"
                  />
                  <img 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgMTAwIj48dGV4dCB4PSIwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwMCIgZm9udC1zdHlsZT0iaXRhbGljIj48dHNwYW4gZmlsbD0iIzkwRkYxNyI+TXk8L3RzcGFuPjx0c3BhbiBmaWxsPSIjMDA3OEZGIj5Kb3VybmFsPC90c3Bhbj48L3RleHQ+PC9zdmc+" 
                    alt="MyJournal Text"
                    className="h-6"
                  />
                </button>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </button>
                  <button
                    onClick={() => setIsCreatingSection(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FolderPlus className="h-5 w-5 mr-2 text-gray-500" />
                    New Folder
                  </button>
                  <button
                    onClick={() => setIsWriting(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    New Entry
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1 flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search entries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="w-64 relative">
                    <TagIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">All Tags</option>
                      {allTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{entries.length} Entries</span>
                </div>
              </div>
            </div>
            <div className="mx-auto p-2">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              <div className="flex flex-col space-y-6">
                {isCreatingSection ? (
                  <CreateSection onSave={addSection} onCancel={() => setIsCreatingSection(false)} />
                ) : editingSection ? (
                  <EditSection
                    section={editingSection}
                    onSave={updateSection}
                    onDelete={deleteSection}
                    onCancel={() => setEditingSection(null)}
                  />
                ) : isWriting || editingEntry ? (
                  <JournalEntry
                    onSave={editingEntry ? updateEntry : addEntry}
                    onCancel={() => {
                      setIsWriting(false);
                      setEditingEntry(null);
                    }}
                    sections={sections}
                    selectedSection={editingEntry?.section_id || selectedSection}
                    onSelectSection={setSelectedSection}
                    initialEntry={editingEntry}
                  />
                ) : (
                  <>
                    {showFilters && (
                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">From</label>
                                <input
                                  type="date"
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">To</label>
                                <input
                                  type="date"
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <SectionSelector
                                sections={sections}
                                selectedSection={selectedSection}
                                onSelectSection={(sectionId) => {
                                  setSelectedSection(sectionId);
                                  fetchEntries();
                                }}
                                onEditSection={setEditingSection}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <JournalList entries={filteredEntries} onEditEntry={setEditingEntry} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;