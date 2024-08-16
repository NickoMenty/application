import { z } from 'zod';
import { randomUUID } from 'node:crypto';

export default class UpdateItem implements UpdateItemInPort {
  constructor(
    protected presenter: UpdateItemOutPort,
    protected itemRepo: ItemRepository,
    protected fileRepo: FileRepository,
  ) {}

  async execute({
    id, title, price, description, userId, files,
  }: UpdateItemIn): Promise<void> {
    z.object({
      id: z.number().min(1),
      title: z.string().trim(),
      price: z.number(),
      description: z.string().trim(),
      userId: z.number().min(1),
    }).parse({
      id, title, price, description, userId,
    });

    const item = await this.itemRepo.update({
      id, title, price, description, userId,
    });

    if (item && files.length) {
      const oldFiles = await this.fileRepo.list({ entity: 'item', entityId: item.id });
      await Promise.all(oldFiles.map((file) => this.fileRepo.delete(file.id)));

      await Promise.all(files.map(async (file) => this.fileRepo.create(file, {
        name: `${randomUUID()}.${file.name.split('.').slice(-1)}`,
        entity: 'item',
        entityId: item.id,
      })));
    }

    this.presenter.present({ item });
  }
}
