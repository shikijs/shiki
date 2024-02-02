import { ShikiError } from '@shikijs/core'

export class ShikiCompatError extends ShikiError {
  constructor(message: string) {
    super(message)
    this.name = 'ShikiCompatError'
  }
}
