import { useId, useMemo } from 'react'
import Select, { type SingleValue, type StylesConfig } from 'react-select'

export type SelectOption = {
  value: string | number
  label: string
}

type ReactSelectOption = {
  value: number
  label: string
}

type SelectFieldProps = {
  label: string
  value: string | number
  onChange: (value: number) => void
  options: SelectOption[]
  className?: string
  id?: string
  /** Associates the control with an external heading (e.g. section h2). */
  labelledById?: string
  isDisabled?: boolean
  placeholder?: string
}

const selectStyles: StylesConfig<ReactSelectOption, false> = {
  control: (styles, { isFocused, isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled ? '#f2f4f7' : '#fff',
    borderColor: isFocused ? '#174e75' : '#ccd3da',
    minHeight: 40,
    padding: '0 2px',
    borderRadius: 4,
    boxShadow: isFocused ? '0 0 0 1px #174e75' : 'none',
    outline: 'none',
    cursor: isDisabled ? 'not-allowed' : 'default',
    '&:hover': {
      borderColor: isFocused ? '#174e75' : '#ccd3da',
    },
  }),
  singleValue: (styles) => ({
    ...styles,
    color: '#20252b',
    fontSize: '0.95rem',
  }),
  placeholder: (styles) => ({
    ...styles,
    color: '#53616c',
    fontSize: '0.95rem',
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? '#174e75' : isFocused ? '#eef1f4' : '#fff',
    color: isSelected ? '#fff' : '#20252b',
    fontSize: '0.95rem',
    cursor: 'pointer',
  }),
  menu: (styles) => ({
    ...styles,
    zIndex: 9999,
    backgroundColor: '#fff',
    border: '1px solid #ccd3da',
    borderRadius: 4,
    overflow: 'hidden',
  }),
  menuPortal: (styles) => ({
    ...styles,
    zIndex: 9999,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: '#53616c',
  }),
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  className = 'field',
  id: idProp,
  labelledById,
  isDisabled = false,
  placeholder = 'Select…',
}: SelectFieldProps) {
  const autoId = useId()
  const inputId = idProp ?? autoId
  const labelId = `${inputId}-label`
  const ariaLabelledBy = labelledById ?? labelId

  const selectOptions = useMemo(
    (): ReactSelectOption[] =>
      options.map((option) => ({
        value: Number(option.value),
        label: option.label,
      })),
    [options],
  )

  const selected =
    selectOptions.find((option) => option.value === Number(value)) ?? null

  const handleChange = (option: SingleValue<ReactSelectOption>) => {
    if (option) {
      onChange(option.value)
    }
  }

  return (
    <div className={className}>
      <label className="field-label" id={labelId} htmlFor={inputId}>
        {label}
      </label>
      <Select<ReactSelectOption, false>
        inputId={inputId}
        instanceId={inputId}
        aria-labelledby={ariaLabelledBy}
        options={selectOptions}
        value={selected}
        onChange={handleChange}
        isDisabled={isDisabled}
        isSearchable={false}
        placeholder={placeholder}
        styles={selectStyles}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        classNamePrefix="workplace-select"
      />
    </div>
  )
}
