import { z } from 'zod';
import { randomUUID } from 'node:crypto';

export default class CreateItem implements CreateItemInPort {
  constructor(
    protected presenter: CreateItemOutPort,
    protected itemRepo: ItemRepository,
    protected fileRepo: FileRepository,
  ) {}

  async execute({
    title, price, description, userId, files,
  }: CreateItemIn): Promise<void> {
    z.object({
      title: z.string().trim(),
      price: z.number(),
      description: z.string().trim(),
      userId: z.number().min(1),
    }).parse({
      title, price, description, userId,
    });

    const item = await this.itemRepo.create({
      title, price, description, userId,
    });

    await Promise.all(files.map(async (file) => this.fileRepo.create(file, {
      name: `${randomUUID()}.${file.name.split('.').slice(-1)}`,
      entity: 'item',
      entityId: item.id,
    })));

    this.presenter.present({ item });
  }
}
