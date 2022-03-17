const NAMESPACE = 'labelup'

class EventBus {

  #socket

  set socket(socket) {
    this.#socket = socket
  }

  validateSocket() {
    if (!this.#socket) {
      throw new Error('Socket not available')
    }
  }

  emit(clientKey, name, payload) {
    this.validateSocket()

    const eventName = `${NAMESPACE}:${name}`
    this.#socket.in(clientKey).emit(eventName, payload)
  }
}

export default new EventBus()
