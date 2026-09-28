export function TextField({ label, value, onChange, placeholder, type = "text", required, hint }) {
  return (
    <div className="adm-field">
      <label className="adm-label">
        {label}
        {required && <span className="adm-req"> *</span>}
      </label>
      <input
        className="adm-input"
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="adm-hint adm-hint-block">{hint}</p>}
    </div>
  );
}

export function TextArea({ label, value, onChange, rows = 4, placeholder, required, hint }) {
  return (
    <div className="adm-field">
      <label className="adm-label">
        {label}
        {required && <span className="adm-req"> *</span>}
      </label>
      <textarea
        className="adm-input adm-textarea"
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="adm-hint adm-hint-block">{hint}</p>}
    </div>
  );
}

export function SelectField({ label, value, onChange, options, required, hint }) {
  return (
    <div className="adm-field">
      <label className="adm-label">
        {label}
        {required && <span className="adm-req"> *</span>}
      </label>
      <select className="adm-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {!options.includes(value) && <option value={value ?? ""}>{value || "— select —"}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {hint && <p className="adm-hint adm-hint-block">{hint}</p>}
    </div>
  );
}
