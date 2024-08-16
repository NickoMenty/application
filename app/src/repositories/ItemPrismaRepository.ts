import { Prisma, PrismaClient, Item as ItemModel } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import ItemDomain from '@/domains/ItemDomain';

export default class ItemPrismaRepository implements ItemRepository {
  constructor(protected db: Omit<PrismaClient, runtime.ITXClientDenyList>) {}

  async list(filters: ItemFilters): Promise<Item[]> {
    const where: Prisma.ItemWhereInput = {
      deletedAt: null,
    };

    if ('id' in filters) {
      where.id = filters.id;
    }

    if ('userId' in filters) {
      where.userId = filters.userId;
    }

    if ('customerId' in filters) {
      where.customerId = filters.customerId;
    }

    const list = await this.db.item.findMany({ where });

    return list.map(this.fromModel);
  }

  async create(data: CreateItemDto): Promise<Item> {
    return this.fromModel(await this.db.item.create({
      data: {
        title: data.title,
        price: data.price,
        description: data.description,
        userId: data.userId,
      },
    }));
  }

  async item({ id }: ItemFilters): Promise<Item | null> {
    const item = await this.db.item.findFirst({ where: { id } });

    if (!item) return null;

    return this.fromModel(item);
  }

  async update(data: UpdateItemDto): Promise<Item> {
    return this.fromModel(await this.db.item.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        price: data.price,
        description: data.description,
        userId: data.userId,
      },
    }));
  }

  async delete(id: ItemId): Promise<void> {
    await this.fromModel(await this.db.item.update({
      where: { id, customer: null },
      data: { deletedAt: new Date() },
    }));
  }

  private fromModel({
    id, title, price, description, userId, customerId, contractId, createdAt, updatedAt, deletedAt,
  }: ItemModel): Item {
    return new ItemDomain(
      id,
      title,
      price,
      description,
      userId,
      customerId,
      contractId,
      createdAt,
      updatedAt,
      deletedAt || undefined,
    );
  }

  private toModel(domain: Item): ItemModel {
    return {
      id: domain.id,
      title: domain.title,
      price: domain.price,
      description: domain.description,
      userId: domain.userId,
      customerId: domain.customerId,
      contractId: domain.contractId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      deletedAt: domain.deletedAt || null,
    };
  }
}
