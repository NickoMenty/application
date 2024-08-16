export default class GetItems implements GetItemsInPort {
  constructor(
    protected presenter: GetItemsOutPort,
    protected itemRepo: ItemRepository,
    protected fileRepo: FileRepository,
  ) {}

  async execute({ userId, customerId }: GetItemsIn = {}): Promise<void> {
    const items = await this.itemRepo.list({ userId, customerId });

    this.presenter.present({
      items: await Promise.all(items.map(async (item) => {
        // eslint-disable-next-line no-param-reassign
        item.files = await this.fileRepo.list({
          entity: 'item',
          entityId: item.id,
        });

        return item;
      })),
    });
  }
}
