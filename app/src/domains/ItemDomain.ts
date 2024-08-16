export default class ItemDomain implements Item {
  files: FileDto[] = [];

  constructor(
    public id: ItemId,
    public title: string,
    public price: number,
    public description: string,
    public userId: UserId,
    public customerId: UserId | null,
    public contractId: ItemContractId | null,
    public createdAt: CreatedAt,
    public updatedAt: UpdatedAt,
    public deletedAt?: DeletedAt,
  ) {
  }
}
