export type RequestRecord = {
  id: string
  tenant: string
  actor: string
  title: string
  status: string
}

export type AccountContext = {
  tenant: string
  actor: string
  role: string
}

export type ApiError = {
  status: number
  message: string
}

export type ListPhase = 'loading' | 'empty' | 'ready' | 'error'

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    'message' in value &&
    typeof (value as ApiError).message === 'string'
  )
}
