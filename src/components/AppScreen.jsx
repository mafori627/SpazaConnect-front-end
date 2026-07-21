import BottomNav from './BottomNav'
import './AppScreen.css'

export default function AppScreen({ header, children }) {
  return (
    <div className="app-screen">
      <div className="app-frame">
        {header}
        <div className="app-body">{children}</div>
        <BottomNav />
      </div>
    </div>
  )
}
