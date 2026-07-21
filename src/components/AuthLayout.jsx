import { ShoppingCart } from 'lucide-react'
import VillageIllustration from './VillageIllustration'
import './AuthLayout.css'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <ShoppingCart size={28} color="#fff" strokeWidth={2.2} />
          </div>
          <span className="auth-wordmark">SpazaConnect</span>
          <p className="auth-tagline">Stronger together, cheaper together.</p>
        </div>

        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}

        {children}

        <p className="auth-terms">
          By continuing, you agree to our <a href="#">Terms &amp; Conditions</a>
        </p>
      </div>

      <VillageIllustration />
    </div>
  )
}
