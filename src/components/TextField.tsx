import { useId, type ChangeEvent } from 'react'

type TextFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  maxLength?: number
  error?: string | null
  id?: string
}

export function TextField({
  label,
  value,
  onChange,
  disabled,
  maxLength,
  error,
  id: idProp,
}: TextFieldProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const errorId = error ? `${id}-error` : undefined

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <>
      <div className="field">
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          className="field-control"
          type="text"
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
        />
      </div>
      {error && (
        <p id={errorId} className="status error" role="alert">
          {error}
        </p>
      )}
    </>
  )
}
