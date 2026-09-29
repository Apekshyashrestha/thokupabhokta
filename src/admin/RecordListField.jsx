export default function RecordListField({ label, value, onChange, subFields, newRow, hint }) {
  const rows = Array.isArray(value) ? value : [];

  const update = (index, key, next) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: next } : row)));

  const remove = (index) => onChange(rows.filter((_, i) => i !== index));

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  };

  const add = () => onChange([...rows, { ...newRow }]);

  return (
    <div className="adm-field">
      <div className="adm-label">
        {label}
        <span className="adm-label-hint">({rows.length} row{rows.length === 1 ? "" : "s"})</span>
      </div>

      {rows.length > 0 && (
        <div className="adm-rows">
          {rows.map((row, index) => (
            <div className="adm-row" key={index}>
              <div className="adm-row-main">
                {subFields.map((f) => (
                  <input
                    key={f.key}
                    className="adm-input adm-input-sm"
                    placeholder={f.label}
                    value={row[f.key] ?? ""}
                    onChange={(e) => update(index, f.key, e.target.value)}
                  />
                ))}
              </div>
              <div className="adm-row-actions">
                <button
                  type="button"
                  className="adm-icon-btn"
                  title="Move up"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="adm-icon-btn"
                  title="Move down"
                  disabled={index === rows.length - 1}
                  onClick={() => move(index, 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="adm-icon-btn adm-icon-btn-danger"
                  title="Remove"
                  onClick={() => remove(index)}
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button type="button" className="adm-btn adm-btn-ghost" onClick={add}>
        + Add row
      </button>

      {hint && <p className="adm-hint adm-hint-block">{hint}</p>}
    </div>
  );
}
