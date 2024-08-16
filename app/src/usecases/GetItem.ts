export default class GetItem implements GetItemInPort {
  constructor(
    protected presenter: GetItemOutPort,
    protected itemRepo: ItemRepository,
    protected fileRepo: FileRepository,
  ) {}

  async execute({ id }: GetItemIn): Promise<void> {
    const item = await this.itemRepo.item({ id });

    if (item) {
      item.files = await this.fileRepo.list({ entity: 'item', entityId: item.id });
    }

    this.presenter.present({ item });
  }
}
