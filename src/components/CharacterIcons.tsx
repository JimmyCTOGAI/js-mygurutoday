import React, { useState } from 'react'

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

const CHARACTERS: Character[] = [
  {
    id: 'jen',
    name: 'Jen',
    image: 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/logo/Guruu%20Jen%20Head.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9sb2dvL0d1cnV1IEplbiBIZWFkLnBuZyIsImlhdCI6MTc0MzAwNjg1MywiZXhwIjoyMDU4MzY2ODUzfQ.epMtRR-cN7XqB8i8r68MFd7OzyoaBtN1CDCFBF3EpjY',
    fullImage: 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/characters/Jen.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jaGFyYWN0ZXJzL0plbi5wbmciLCJpYXQiOjE3NDMxMTY4NTMsImV4cCI6MjA1ODQ3Njg1M30.8X5hMLGwC7Ur0YgX8pGWNu_zJ7mCYkTkKE6k8QQxHtE',
    role: 'Business Development > Marketing Strategy',
    greeting: "Hi there! I'm excited to help you develop your marketing strategy.",
    question: "Shall we review your current marketing campaigns?",
    description: "Develop the World's Most Effective Digital Marketing Campaigns"
  },
  {
    id: 'dwayne',
    name: 'Dwayne',
    image: 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/logo/Guruu%20Dr.%20Head.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9sb2dvL0d1cnV1IERyLiBIZWFkLnBuZyIsImlhdCI6MTc0MzAwNzQxNSwiZXhwIjoyMDU4MzY3NDE1fQ.BId9JTP0EYay1FB3plfg0kP-FggugqG8zPU2sKh68Lo',
    fullImage: 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/characters/Dwayne.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jaGFyYWN0ZXJzL0R3YXluZS5wbmciLCJpYXQiOjE3NDMxMTY4NTMsImV4cCI6MjA1ODQ3Njg1M30.8X5hMLGwC7Ur0YgX8pGWNu_zJ7mCYkTkKE6k8QQxHtE',
    role: 'Business Development > Financial Planning',
    greeting: "Welcome back! Let's look at your financial goals.",
    question: "Would you like to review your investment portfolio?",
    description: "Create the Most Profitable Investment Strategy"
  },
  {
    id: 'oz',
    name: 'Oz',
    image: 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/logo/Guruu%20Oz%20Head.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9sb2dvL0d1cnV1IE96IEhlYWQucG5nIiwiaWF0IjoxNzQzMDA3NTMxLCJleHAiOjIwNTgzNjc1MzF9.hqhIuruPF-rn9O7Iz0CDH1F9t6t_Od7PntuoUchBCi0',
    fullImage: 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/characters/Oz.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jaGFyYWN0ZXJzL096LnBuZyIsImlhdCI6MTc0MzExNjg1MywiZXhwIjoyMDU4NDc2ODUzfQ.8X5hMLGwC7Ur0YgX8pGWNu_zJ7mCYkTkKE6k8QQxHtE',
    role: 'MY BIG BUSINESS > Business Development',
    greeting: "Hey Steve, It's good to see you again, I'm glad you are back.",
    question: "Have you been out playing golf today?",
    description: "Develop the World's Best AI Generated Mentorship Program"
  },
  {
    id: 'ryan',
    name: 'Ryan',
    image: 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/logo/Guruu%20Ryan%20Head.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9sb2dvL0d1cnV1IFJ5YW4gSGVhZC5wbmciLCJpYXQiOjE3NDMwMDc1OTksImV4cCI6MjA1ODM2NzU5OX0.2ax8CqBpKkA6fxLXig9rfnNj5fx-tUDyqQA834zNL1s',
    fullImage: 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/characters/Ryan.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jaGFyYWN0ZXJzL1J5YW4ucG5nIiwiaWF0IjoxNzQzMTE2ODUzLCJleHAiOjIwNTg0NzY4NTN9.8X5hMLGwC7Ur0YgX8pGWNu_zJ7mCYkTkKE6k8QQxHtE',
    role: 'Business Development > Operations',
    greeting: "Great to see you! Ready to optimize your operations?",
    question: "How's your workflow automation project coming along?",
    description: "Build the Most Efficient Business Operations System"
  }
];

const LOGO_URL = 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/icons/My%20Guruuz.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pY29ucy9NeSBHdXJ1dXoucG5nIiwiaWF0IjoxNzQzMDA2NTUxLCJleHAiOjIwNTgzNjY1NTF9.x7xjhcvf_TKTS09r5du3zQtzznVoWcTv1E2V-E2QIYs';

interface CharacterIconsProps {
  onCharacterSelect: (character: Character) => void;
}

export function CharacterIcons({ onCharacterSelect }: CharacterIconsProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[2]); // Default to Oz

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
    onCharacterSelect(character);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {/* Top row characters */}
        <div className="flex items-center justify-center">
          <div 
            className={`text-center cursor-pointer transition-transform hover:scale-105 ${
              selectedCharacter.id === CHARACTERS[0].id ? 'ring-2 ring-blue-500 rounded-full' : ''
            }`}
            onClick={() => handleCharacterClick(CHARACTERS[0])}
          >
            <img 
              src={CHARACTERS[0].image} 
              alt={CHARACTERS[0].name} 
              className="w-16 h-16 rounded-full" 
              loading="lazy"
            />
            <p className="mt-1 text-sm text-gray-600">{CHARACTERS[0].name}</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div 
            className={`text-center cursor-pointer transition-transform hover:scale-105 ${
              selectedCharacter.id === CHARACTERS[1].id ? 'ring-2 ring-blue-500 rounded-full' : ''
            }`}
            onClick={() => handleCharacterClick(CHARACTERS[1])}
          >
            <img 
              src={CHARACTERS[1].image} 
              alt={CHARACTERS[1].name} 
              className="w-16 h-16 rounded-full" 
              loading="lazy"
            />
            <p className="mt-1 text-sm text-gray-600">{CHARACTERS[1].name}</p>
          </div>
        </div>
        
        {/* Center logo */}
        <div className="col-span-2 flex justify-center items-center py-2">
          <img 
            src={LOGO_URL} 
            alt="MyGuruu" 
            className="h-[75px] object-contain" 
            loading="lazy"
          />
        </div>
        
        {/* Bottom row characters */}
        <div className="flex items-center justify-center">
          <div 
            className={`text-center cursor-pointer transition-transform hover:scale-105 ${
              selectedCharacter.id === CHARACTERS[2].id ? 'ring-2 ring-blue-500 rounded-full' : ''
            }`}
            onClick={() => handleCharacterClick(CHARACTERS[2])}
          >
            <img 
              src={CHARACTERS[2].image} 
              alt={CHARACTERS[2].name} 
              className="w-16 h-16 rounded-full" 
              loading="lazy"
            />
            <p className="mt-1 text-sm text-gray-600">{CHARACTERS[2].name}</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div 
            className={`text-center cursor-pointer transition-transform hover:scale-105 ${
              selectedCharacter.id === CHARACTERS[3].id ? 'ring-2 ring-blue-500 rounded-full' : ''
            }`}
            onClick={() => handleCharacterClick(CHARACTERS[3])}
          >
            <img 
              src={CHARACTERS[3].image} 
              alt={CHARACTERS[3].name} 
              className="w-16 h-16 rounded-full" 
              loading="lazy"
            />
            <p className="mt-1 text-sm text-gray-600">{CHARACTERS[3].name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}