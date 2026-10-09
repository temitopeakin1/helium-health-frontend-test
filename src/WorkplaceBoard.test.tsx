import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from './mock-api-client'
import { WorkplaceBoard } from './WorkplaceBoard'

async function chooseDemoAccount(optionLabel: string) {
  const field = document.getElementById('demo-account')?.closest('.field')
  const control = field?.querySelector('.workplace-select__control')
  if (!control) {
    throw new Error('Select control not found')
  }
  fireEvent.mouseDown(control, { button: 0 })
  fireEvent.click(await screen.findByText(optionLabel))
}

describe('WorkplaceBoard', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('ignores stale list data after an out-of-order account switch', async () => {
    render(<WorkplaceBoard />)

    expect(screen.getByRole('status')).toHaveTextContent(/loading requests/i)

    await chooseDemoAccount('South / Kim (manager)')

    await waitFor(() => {
      expect(screen.getByText('Monitor')).toBeInTheDocument()
    })
    expect(screen.queryByText('Desk')).not.toBeInTheDocument()

    await waitFor(
      () => {
        expect(screen.queryByText('Desk')).not.toBeInTheDocument()
      },
      { timeout: 1000 },
    )
  })

  it('shows a server validation error and preserves the draft on rejected create', async () => {
    vi.useFakeTimers()
    render(<WorkplaceBoard />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(650)
    })

    api.failNext(422)

    const titleInput = screen.getByLabelText(/^title$/i)
    fireEvent.change(titleInput, { target: { value: 'New laptop' } })
    fireEvent.click(screen.getByRole('button', { name: /submit request/i }))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(650)
    })

    expect(screen.getByText(/Enter a more specific title/i)).toBeInTheDocument()
    expect(titleInput).toHaveValue('New laptop')
  })
})
