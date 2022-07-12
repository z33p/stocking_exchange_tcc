import { contextBridge } from 'electron'
import Domain from './domain'
import Ipc from './ipc'

contextBridge.exposeInMainWorld('Domain', Domain)
contextBridge.exposeInMainWorld('Ipc', Ipc)
