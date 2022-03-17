import 'chai/register-should'

import { convert } from '../../../src/utils/adf'
import { falcon9 } from './contents'

describe('adf', () => {
  describe('convert', () => {
    it('should exist', () => {
      const data = convert(falcon9)
      should.exist(data)
    })
  })
})
