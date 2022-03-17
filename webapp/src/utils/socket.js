import io from 'socket.io-client'
import { getToken } from './auth'

const NAMESPACE = 'labelup'

class Socket {

  #contentId
  #socket

  constructor(contentId, token) {
    this.#contentId = contentId

    if (token) {
      this.#socket = io({
        autoConnect: false,
        forceNew: true,
        transports: ['websocket'],
        query: {
          jwt: token
        }
      })
    }
  }

  validateSocket() {
    if (!this.#socket) {
      throw new Error('Socket not available')
    }
  }

  connect() {
    this.validateSocket()
    this.#socket.connect()
  }

  disconnect() {
    this.validateSocket()
    this.#socket.disconnect()
  }

  onEventReceived(name, cb) {
    this.validateSocket()

    const eventName = `${NAMESPACE}:${name}`

    this.#socket.on(eventName, (event) => {
      const content = event.content

      if (content && content.id === this.#contentId) {
        cb(event)
      }
    })
  }

  onConnect(cb) {
    this.validateSocket()
    this.#socket.on('connect', cb)
  }

  onDisconnect(cb) {
    this.validateSocket()
    this.#socket.on('disconnect', cb)
  }
}

export async function create(contentId) {
  const token = await getToken()
  return new Socket(contentId, token)
}
