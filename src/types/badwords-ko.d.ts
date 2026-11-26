declare module 'badwords-ko' {
  export default class Filter {
    constructor(options?: { list?: string[] });
    isProfane(text: string): boolean;
  }
}
