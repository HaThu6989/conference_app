export class ConferenceTooEarly extends Error {
  constructor(){
    super("Conference must happen in at least 3 days")
  }
}