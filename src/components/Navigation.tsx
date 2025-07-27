import { Shield, ArrowDown, Github, Heart } from 'lucide-react'
import { ReactNode, useState, useEffect } from 'react'

type Tab = { label: string, icon: ReactNode }

export default function Navigation({ extraTabs = [] }: { extraTabs?: Tab[] }) {
  const [activeSection, setActiveSection] = useState('home')
  
  const documentationTab = extraTabs.find(tab => tab.label.toLowerCase() === 'documentation')
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100
      const downloadsSection = document.getElementById('downloads')
      
      if (downloadsSection) {
        const downloadsTop = downloadsSection.offsetTop
        const downloadsBottom = downloadsTop + downloadsSection.offsetHeight
        
        setActiveSection(scrollPosition >= downloadsTop && scrollPosition < downloadsBottom ? 'download' : 'home')
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const handleNavClick = (section: string) => {
    if (section === 'download') {
      document.getElementById('downloads')?.scrollIntoView({ behavior: 'smooth' })
    } else if (section === 'github') {
      window.open('https://github.com/mi-lrn/SH13LD', '_blank')
    } else if (section === 'home') {
      const heroSection = document.querySelector('section')
      heroSection ? heroSection.scrollIntoView({ behavior: 'smooth' }) : window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setActiveSection(section)
  }
  
  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-card/80 backdrop-blur-md border border-border rounded-full px-6 py-3">
        <NavItem 
          icon={Shield} 
          label="Home" 
          active={activeSection === 'home'}
          onClick={() => handleNavClick('home')}
        />
        <NavItem 
          icon={ArrowDown} 
          label="Download" 
          active={activeSection === 'download'}
          onClick={() => handleNavClick('download')}
        />
        {documentationTab && (
          <NavItem 
            icon={documentationTab.icon} 
            label={documentationTab.label} 
            onClick={() => window.open('https://github.com/mi-lrn/SH13LD/blob/main/README.md', '_blank')} 
          />
        )}
        <NavItem 
          icon={Github} 
          label="GitHub" 
          onClick={() => handleNavClick('github')}
        />
        <NavItem 
          icon={Heart} 
          label="Donate" 
          onClick={() => window.open('https://ko-fi.com/', '_blank')} 
        />
      </div>
    </nav>
  )
}

function NavItem({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active?: boolean,
  onClick?: () => void
}) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
        ${active 
          ? 'bg-primary text-primary-foreground shadow-lg shadow-cyber-glow/25' 
          : 'hover:bg-muted hover:text-foreground text-muted-foreground'
        }
      `}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}
