export class User {
  constructor(
    public email: string,
    public phone: string,
    public name?: string,
    public _id?: string,
    public tpye?: string,
    public status?: string
  ) {}
}
