import 'chai/register-should'
import 'chai/register-expect'

import { getStatusFromProperty } from '../../../src/services/status'
import { propertyOkPending } from './properties'
import { statusSN13 } from './statuses'

const testGetStatusForProperty = (property, result) => {
  let status
  before(() => {
    status = getStatusFromProperty(property)
  })
  describe('propertyOkPending', () => {
    it('should exist', () => {
      should.exist(status)
    })
    it('expect to equal', () => {
      expect(JSON.stringify(status)).to.equal(JSON.stringify(result))
    })
  })
}

describe('status', () => {
  describe('getStatus', () => {
     testGetStatusForProperty(propertyOkPending, statusSN13)
  })
})

