export class ShikiTwoslashError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ShikiTwoslashError'
  }
}
