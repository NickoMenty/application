export default class GetItemContract implements GetItemContractInPort {
  constructor(
    protected presenter: GetItemContractOutPort,
    protected itemContractRepo: ItemContractRepository,
  ) {}

  async execute({ id }: GetItemContractIn): Promise<void> {
    this.presenter.present({ contract: await this.itemContractRepo.findById(id) });
  }
}
