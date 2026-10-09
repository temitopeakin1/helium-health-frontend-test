import { SearchField } from './components/SearchField'
import { SelectField } from './components/SelectField'
import { TextField } from './components/TextField'
import type { DemoAccount } from './mock-api-client'
import { useWorkplaceBoard } from './useWorkplaceBoard'
import './App.css'

export function WorkplaceBoard() {
  const {
    accounts,
    selectedIndex,
    context,
    selectAccount,
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
  } = useWorkplaceBoard()

  const isManager = context.role === 'manager'

  const accountOptions = accounts.map((account: DemoAccount, i: number) => ({
    value: i,
    label: account.label,
  }))

  return (
    <main className="board">
      <h1>Workplace requests</h1>

      <section aria-labelledby="demo-account-heading" className="panel">
        <h2 id="demo-account-heading">Demo account</h2>
        <div className="field-shell">
          <SelectField
            id="demo-account"
            label="Demo account"
            value={selectedIndex}
            onChange={selectAccount}
            options={accountOptions}
          />
        </div>
      </section>

      <section aria-labelledby="create-heading" className="panel">
        <h2 id="create-heading">New request</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void submitCreate()
          }}
        >
          <TextField
            label="Title"
            value={titleDraft}
            onChange={setTitleDraft}
            maxLength={120}
            disabled={createPending}
            error={createError}
          />
          <button
            type="submit"
            disabled={!canSubmitCreate}
            aria-busy={createPending}
          >
            {createPending && (
              <span className="button-spinner" aria-hidden="true" />
            )}
            {createPending ? 'Submitting…' : 'Submit request'}
          </button>
        </form>
      </section>

      <section aria-labelledby="requests-heading" className="panel">
        <div className="requests-header">
          <h2 id="requests-heading">Requests</h2>
          {listPhase === 'ready' && (
            <SearchField
              id="request-search"
              label="Search requests"
              hideLabel
              value={searchQuery}
              onChange={setSearchQuery}
            />
          )}
        </div>

        {listPhase === 'loading' && (
          <p className="status" role="status">
            Loading requests…
          </p>
        )}

        {listPhase === 'error' && (
          <p className="status error" role="alert">
            {listError}
          </p>
        )}

        {listPhase === 'empty' && (
          <p className="status">No requests yet.</p>
        )}

        {listPhase === 'ready' && (
          <>
            {filteredRecords.length === 0 ? (
              <p className="status" role="status">
                No requests match your search.
              </p>
            ) : (
              <ul id="request-list" className="request-list">
                {filteredRecords.map((record) => (
                  <li key={record.id} className="request-item">
                    <span className="request-title">{record.title}</span>
                    <div className="request-actions">
                      <span className="request-status">{record.status}</span>
                      {isManager && record.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => approveRequest(record.id)}
                          disabled={approvingId === record.id}
                          aria-busy={approvingId === record.id}
                        >
                          {approvingId === record.id ? 'Approving…' : 'Approve'}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {actionError && (
          <p className="status error" role="alert">
            {actionError}
          </p>
        )}
      </section>
    </main>
  )
}
