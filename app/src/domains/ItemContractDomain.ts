export default class ItemContractDomain implements ItemContract {
  constructor(
    public id: ItemContractId,
    public data: string,
    public url: string,
    public createdAt: CreatedAt,
    public updatedAt: UpdatedAt,
  ) {
  }
}
