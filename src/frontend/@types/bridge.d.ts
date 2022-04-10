import { api } from '../../domain/bridge'

declare global {
  // eslint-disable-next-line
  interface Window {
    Main: typeof api
  }
}
