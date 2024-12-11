export class MatchingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MatchingError';
    Object.setPrototypeOf(this, MatchingError.prototype);
  }
}