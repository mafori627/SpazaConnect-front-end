import { NavLink } from 'react-router-dom'
import { Home, ShoppingBag, Users, ClipboardList, User } from 'lucide-react'
import './BottomNav.css'

const tabs = [
  { to: '/dashboard', label: 'Home', Icon: Home },
  { to: '/products', label: 'Products', Icon: ShoppingBag },
  { to: '/pools', label: 'Pools', Icon: Users },
  { to: '/orders', label: 'Orders', Icon: ClipboardList },
  { to: '/profile', label: 'Profile', Icon: User },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => 'bottom-nav-item' + (isActive ? ' active' : '')}
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
