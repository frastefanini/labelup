/*global AP*/
/// <reference path="../../lib/AP.d.ts" />

export async function getToken() {
  if (AP) {
    const token = await AP.context.getToken()
    return token
  }

  return null
}
