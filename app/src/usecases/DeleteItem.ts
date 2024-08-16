import { z } from 'zod';

export default class DeleteItem implements DeleteItemInPort {
  constructor(
    protected presenter: DeleteItemOutPort,
    protected itemRepo: ItemRepository,
  ) {}

  async execute({ id }: DeleteItemIn): Promise<void> {
    z.object({ id: z.number().min(1) }).parse({ id });

    await this.itemRepo.delete(id);

    this.presenter.present({ status: true });
  }
}
