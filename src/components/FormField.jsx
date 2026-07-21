export default function FormField({ label, id, error, icon: Icon, ...inputProps }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        {Icon && <Icon size={18} className="input-icon" />}
        <input
          id={id}
          name={id}
          {...inputProps}
          aria-invalid={!!error}
          className={Icon ? 'has-icon' : undefined}
        />
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
