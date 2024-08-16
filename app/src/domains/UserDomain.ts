export default class UserDomain implements User {
  constructor(
    public id: UserId,
    public email: Email,
    public firstName: string,
    public lastName: string,
    public password: string,
    public address: string,
    public mnemonic: string,
    public privateKey: string,
    public createdAt: CreatedAt,
    public updatedAt: UpdatedAt,
    public deletedAt?: DeletedAt,
  ) {
  }
}
