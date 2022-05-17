export function isProdEnv() {
  return process.env.NODE_ENV === 'production'
}

export function isDevEnv() {
  return !isProdEnv()
}
