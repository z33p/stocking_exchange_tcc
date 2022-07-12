import Domain from "../../domain/bridge/domain";
import Ipc from "../../domain/bridge/ipc";

declare global {
  interface Window {
    Domain: typeof Domain,
    Ipc: typeof Ipc
  }
}
