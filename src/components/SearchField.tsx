import { useId, type ChangeEvent } from 'react'

type SearchFieldProps = {
  label?: string
  hideLabel?: boolean
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  disabled?: boolean
}

export function SearchField({
  label = 'Search',
  hideLabel = false,
  value,
  onChange,
  placeholder = 'Search request',
  id: idProp,
  disabled,
}: SearchFieldProps) {
  const autoId = useId()
  const id = idProp ?? autoId

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className="field field-search">
      {hideLabel ? (
        <label className="visually-hidden" htmlFor={id}>
          {label}
        </label>
      ) : (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        className="field-control"
        type="search"
        role="searchbox"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-controls="request-list"
      />
    </div>
  )
}
