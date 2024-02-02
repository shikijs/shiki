export class ShikiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ShikiError'
  }
}
