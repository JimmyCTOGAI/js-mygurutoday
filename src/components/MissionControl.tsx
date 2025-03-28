import { useState, useCallback, memo } from 'react'
import { FiChevronRight, FiChevronDown } from 'react-icons/fi'

const FOLDER_ICON = 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/icons/Black%20Folder%20Icon.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pY29ucy9CbGFjayBGb2xkZXIgSWNvbi5wbmciLCJpYXQiOjE3NDI4MzYwMjIsImV4cCI6MjA1ODE5NjAyMn0.IQ5XcC0bMA8GAHeG5_2roEfFPvcOqYs0WHzoEsNeFJY'
const PROGRESS_ICON = 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/icons/Growth%20Steps.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pY29ucy9Hcm93dGggU3RlcHMucG5nIiwiaWF0IjoxNzQyODM1ODA4LCJleHAiOjIwNTgxOTU4MDh9.DitrMPMq8mrmQPI4nTqzSPeUWO3Qm3ueoxlf2J_iUQ8'
const DOCUMENTS_ICON = 'https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/icons/Document%20Icon.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pY29ucy9Eb2N1bWVudCBJY29uLnBuZyIsImlhdCI6MTc0MjgzNTkzOSwiZXhwIjoyMDU4MTk1OTM5fQ.hE9o8ifczcx3JTAt3CfY-qGn07PVvQmaQvCUZC9CRbs'

interface NavItem {
  id: string
  label: string
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    id: 'my-big-business',
    label: 'My Big Business',
    children: [
      { id: 'business-dev', label: 'Business Dev' },
      { id: 'finance', label: 'Finance' },
      { id: 'sales', label: 'Sales' },
      { id: 'team-building', label: 'Team Building' }
    ]
  },
  {
    id: 'work-life',
    label: 'Work / Life Balance'
  },
  {
    id: 'health',
    label: 'Health & Fitness'
  },
  {
    id: 'personal-dev',
    label: 'Personal Development'
  }
]

interface NavItemProps {
  item: NavItem
  level?: number
  expanded: Record<string, boolean>
  onToggle: (id: string) => void
  onSelect: (id: string) => void
  selectedItem: string | null
}

const NavItemComponent = memo(function NavItemComponent({ 
  item, 
  level = 0, 
  expanded, 
  onToggle, 
  onSelect,
  selectedItem 
}: NavItemProps) {
  const hasChildren = item.children && item.children.length > 0
  const isExpanded = expanded[item.id]
  const isSelected = selectedItem === item.id
  const isBusinessSection = item.id === 'my-big-business' || 
                          item.id.startsWith('business-') || 
                          item.id === 'finance' || 
                          item.id === 'sales' || 
                          item.id === 'team-building'

  const handleClick = useCallback(() => {
    if (hasChildren) {
      onToggle(item.id)
    }
    onSelect(item.id)
  }, [hasChildren, item.id, onToggle, onSelect])
  
  return (
    <div className="select-none">
      <div 
        className={`
          flex items-center px-4 py-2 cursor-pointer space-x-2
          ${isSelected ? 'bg-gray-200' : 'hover:bg-gray-100'}
        `}
        style={{ paddingLeft: `${(level + 1) * 1.5}rem` }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        {hasChildren && (
          <span className="w-4 h-4 flex items-center justify-center text-black">
            {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </span>
        )}
        <img 
          src={FOLDER_ICON} 
          alt="folder" 
          className="w-4 h-4"
          loading="lazy"
        />
        <span className="flex-1 text-black">{item.label}</span>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="ml-4">
          {item.children.map(child => (
            <NavItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedItem={selectedItem}
            />
          ))}
        </div>
      )}
    </div>
  )
})

export function MissionControl() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'my-big-business': true
  })
  const [selectedItem, setSelectedItem] = useState<string | null>('business-dev')

  const handleToggle = useCallback((id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }, [])

  const handleSelect = useCallback((id: string) => {
    setSelectedItem(id)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-black">Mission Control</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {navigationItems.map(item => (
          <NavItemComponent
            key={item.id}
            item={item}
            expanded={expanded}
            onToggle={handleToggle}
            onSelect={handleSelect}
            selectedItem={selectedItem}
          />
        ))}
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <img 
              src={PROGRESS_ICON} 
              alt="Progress" 
              className="w-24 h-24"
              loading="lazy"
            />
            <div className="flex flex-col ml-2">
              <span className="font-medium text-black">Progress</span>
              <span className="font-medium text-black">On Your Goals</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black">Access Your Documents</span>
            <img 
              src={DOCUMENTS_ICON} 
              alt="Documents" 
              className="w-[50px] h-[50px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  )
}