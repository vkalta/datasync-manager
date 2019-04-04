/*!
 * Contentstack DataSync Manager
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

import dnsSocket from 'dns-socket'
import { EventEmitter } from 'events'
import { getConfig } from '../index'
import { lock, unlock } from './index'

const emitter = new EventEmitter()

let iLock = false
let socket, sm, query, port, dns, currentTimeout

export const init = () => {
  sm = getConfig().syncManager
  socket = dnsSocket({
    retries: sm.inet.retries,
    timeout: sm.inet.timeout
  })
  query = {
    questions: [
      {
        type: sm.inet.type,
        name: sm.inet.host
      }
    ]
  }
  port = sm.inet.port
  dns = sm.inet.dns
  currentTimeout = sm.inet.retryTimeout
  // start checking for net connectivity, 30 seconds after the app has started
  setTimeout(checkNetConnectivity, 30 * 1000)
}

export const checkNetConnectivity = () => {
  socket.query(query, port, dns, (err) => {
    if (err) {
      lock()
      iLock = true
      emitter.emit('disconnected', currentTimeout += sm.inet.retryIncrement)
    } else if (iLock) {
      emitter.emit('ok')
      unlock(true)
    }
  
    socket.destroy()
  })  
}

export const netConnectivityIssues = (error) => {
  if (error.code === 'ENOTFOUND') {
    return true
  } else if (error.code === 'ETIMEDOUT') {
    return true
  }

  return false
}

emitter.on('ok', () => {
  currentTimeout = sm.inet.retryTimeout
  setTimeout(checkNetConnectivity, sm.inet.timeout)
})

emitter.on('disconnected', (timeout) => {
  setTimeout(checkNetConnectivity, timeout)
})