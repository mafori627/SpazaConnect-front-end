import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store, Phone, Mail, MapPin } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import PasswordField from '../components/PasswordField'
import { register } from '../services/authService'
import '../components/forms.css'

const initialForm = {
  username: '', // holds the phone number — see note in Login.jsx
  password: '',
  email: '',
  shopName: '',
  clusterLocation: '',
}

// Mirrors the backend's @Valid constraints on RegisterRequest so the
// person gets feedback before the round trip, not just after it.
function validate(form) {
  const errors = {}
  if (!form.username.trim()) errors.username = 'Phone number cannot be empty'
  else if (form.username.length < 4 || form.username.length > 20)
    errors.username = 'Phone number must be between 4 and 20 characters'

  if (!form.password) errors.password = 'Password cannot be empty'
  else if (form.password.length < 6)
    errors.password = 'Password must be at least 6 characters'

  if (!form.email.trim()) errors.email = 'Email address cannot be empty'
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = 'Please provide a valid email format (e.g., owner@spaza.co.za)'

  if (!form.shopName.trim()) errors.shopName = 'Shop name cannot be blank'
  if (!form.clusterLocation.trim()) errors.clusterLocation = 'Area / zone is required'

  return errors
}

export default function Register() {
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    setSuccess('')

    const errors = validate(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      const res = await register(form)
      setSuccess(res.message || 'Registration successful!')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Join a Buying Pool"
      subtitle="Register your shop to start saving with shops near you."
    >
      {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}
      {success && <div className="alert alert-success" role="status">{success}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Shop Name"
          id="shopName"
          icon={Store}
          placeholder="Sam's Spaza"
          value={form.shopName}
          onChange={handleChange}
          error={fieldErrors.shopName}
        />
        <FormField
          label="Phone Number"
          id="username"
          icon={Phone}
          placeholder="071 123 4567"
          value={form.username}
          onChange={handleChange}
          error={fieldErrors.username}
          autoComplete="tel"
        />
        <FormField
          label="Email"
          id="email"
          icon={Mail}
          type="email"
          placeholder="owner@spaza.co.za"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          autoComplete="email"
        />
        <FormField
          label="Area / Zone"
          id="clusterLocation"
          icon={MapPin}
          placeholder="Orange Farm, Zone 3"
          value={form.clusterLocation}
          onChange={handleChange}
          error={fieldErrors.clusterLocation}
        />
        <PasswordField
          label="Password"
          id="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="new-password"
        />

        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-switch">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  )
}
