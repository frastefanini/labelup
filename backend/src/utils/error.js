class LabelUpError extends Error {
  constructor(message, code, originalError, statusCode) {
    super(message)

    this.code = code
    this.originalError = originalError
    this.statusCode = statusCode

    Error.captureStackTrace(this, LabelUpError)
  }

  toString() {
    let text = ''

    if (this.code) {
      text += `[${this.code}]`
    }

    if (this.message) {
      text += ` ${this.message}`
    }

    if (this.originalError) {
      text += ` (${this.originalError.message})`
    }

    return text
  }
}

export default LabelUpError
