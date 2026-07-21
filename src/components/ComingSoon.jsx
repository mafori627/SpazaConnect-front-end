import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AppScreen from './AppScreen'

export default function ComingSoon({ title, note }) {
  const navigate = useNavigate()
  return (
    <AppScreen
      header={
        <div className="app-header">
          <button className="app-header-icon-btn" onClick={() => navigate('/dashboard')} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <span className="app-header-title">{title}</span>
          <span style={{ width: 34 }} />
        </div>
      }
    >
      <p className="muted-note" style={{ marginTop: 24, textAlign: 'center' }}>
        {note || `${title} is coming soon.`}
      </p>
    </AppScreen>
  )
}
