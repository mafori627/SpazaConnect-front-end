import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Phone } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import PasswordField from '../components/PasswordField'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import '../components/forms.css'

export default function Login() {
  // NOTE: the backend's LoginRequest only has a `username` field, no phone
  // number column exists yet. Until that's added, whatever the person
  // types here is sent to the backend as `username` — see the README note
  // on this. Ask the Backend Lead whether to add a real phone field or
  // just treat phone number as the username going forward.
  const [form, setForm] = useState({ username: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login: setSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    const errors = {}
    if (!form.username.trim()) errors.username = 'Phone number cannot be empty'
    if (!form.password) errors.password = 'Password cannot be empty'
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      const res = await login(form)
      setSession(res.data, form.password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome Back!" subtitle="Login to continue to your account">
      {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
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
        <PasswordField
          label="Password"
          id="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="current-password"
        />

        <div className="form-meta-row">
          <a href="#" className="link-green">Forgot Password?</a>
        </div>

        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <p className="auth-switch">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </AuthLayout>
  )
}
