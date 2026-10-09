import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { accounts, api } from './mock-api-client'
import type { AccountContext, ListPhase, RequestRecord } from './types'
import { isApiError } from './types'

function newRequestKey(): string {
  return crypto.randomUUID()
}

function validateTitle(title: string): string | null {
  const trimmed = title.trim()
  if (trimmed.length < 1 || trimmed.length > 120) {
    return 'Title must be 1-120 characters'
  }
  return null
}

export function useWorkplaceBoard() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const context: AccountContext = accounts[selectedIndex]

  const sessionRef = useRef(0)
  const idempotencyKeyRef = useRef(newRequestKey())

  const [records, setRecords] = useState<RequestRecord[]>([])
  const [listPhase, setListPhase] = useState<ListPhase>('loading')
  const [listError, setListError] = useState<string | null>(null)

  const [titleDraft, setTitleDraft] = useState('')
  const [createPending, setCreatePending] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')

  const loadList = useCallback((sessionId: number, ctx: AccountContext) => {
    api
      .list(ctx)
      .then((result: { records: RequestRecord[] }) => {
        if (sessionRef.current !== sessionId) return
        const rows = result.records
        setRecords(rows)
        setListPhase(rows.length === 0 ? 'empty' : 'ready')
        setListError(null)
      })
      .catch((err: unknown) => {
        if (sessionRef.current !== sessionId) return
        setRecords([])
        setListPhase('error')
        setListError(isApiError(err) ? err.message : 'Request failed')
      })
  }, [])

  useEffect(() => {
    sessionRef.current += 1
    const sessionId = sessionRef.current

    setRecords([])
    setListPhase('loading')
    setListError(null)
    setTitleDraft('')
    setCreateError(null)
    setCreatePending(false)
    setApprovingId(null)
    setActionError(null)
    setSearchQuery('')
    idempotencyKeyRef.current = newRequestKey()

    loadList(sessionId, accounts[selectedIndex])
  }, [selectedIndex, loadList])

  const selectAccount = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const submitCreate = useCallback(async () => {
    const sessionId = sessionRef.current
    const ctx = accounts[selectedIndex]
    const clientError = validateTitle(titleDraft)
    if (clientError) {
      setCreateError(clientError)
      return
    }

    setCreateError(null)
    setCreatePending(true)
    const key = idempotencyKeyRef.current
    const trimmed = titleDraft.trim()

    try {
      const row = await api.create(ctx, trimmed, key)
      if (sessionRef.current !== sessionId) return
      setRecords((prev) => {
        const idx = prev.findIndex((r) => r.id === row.id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = row
          return next
        }
        return [...prev, row]
      })
      setListPhase('ready')
      setTitleDraft('')
      idempotencyKeyRef.current = newRequestKey()
    } catch (err: unknown) {
      if (sessionRef.current !== sessionId) return
      setCreateError(isApiError(err) ? err.message : 'Create failed')
    } finally {
      if (sessionRef.current === sessionId) {
        setCreatePending(false)
      }
    }
  }, [selectedIndex, titleDraft])

  const approveRequest = useCallback(
    async (id: string) => {
      const sessionId = sessionRef.current
      const ctx = accounts[selectedIndex]
      setActionError(null)
      setApprovingId(id)

      try {
        const row = await api.approve(ctx, id)
        if (sessionRef.current !== sessionId) return
        setRecords((prev) =>
          prev.map((r) => (r.id === row.id ? row : r)),
        )
      } catch (err: unknown) {
        if (sessionRef.current !== sessionId) return
        setActionError(isApiError(err) ? err.message : 'Approval failed')
      } finally {
        if (sessionRef.current === sessionId) {
          setApprovingId(null)
        }
      }
    },
    [selectedIndex],
  )

  const trimmedTitle = titleDraft.trim()
  const canSubmitCreate =
    !createPending &&
    trimmedTitle.length >= 1 &&
    trimmedTitle.length <= 120

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return records
    }
    return records.filter((record) =>
      record.title.toLowerCase().includes(query),
    )
  }, [records, searchQuery])

  return {
    accounts,
    selectedIndex,
    context,
    selectAccount,
    records,
    filteredRecords,
    searchQuery,
    setSearchQuery,
    listPhase,
    listError,
    titleDraft,
    setTitleDraft,
    createPending,
    createError,
    canSubmitCreate,
    submitCreate,
    approvingId,
    actionError,
    approveRequest,
  }
}
