import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function PasswordField({ label, id, error, ...inputProps }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <Lock size={18} className="input-icon" />
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          {...inputProps}
          aria-invalid={!!error}
          className="has-icon has-trailing-icon"
        />
        <button
          type="button"
          className="input-trailing-btn"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
