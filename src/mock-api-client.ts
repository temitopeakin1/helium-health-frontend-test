// @ts-expect-error Supplied mock is plain JavaScript without types.
import { accounts, api, createApi } from './mock-api.mjs'
import type { AccountContext } from './types'

export type DemoAccount = AccountContext & { label: string }

export { accounts, api, createApi }
