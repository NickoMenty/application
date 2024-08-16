import ItemContractDomain from '@/domains/ItemContractDomain';
import { PrismaClient, ItemContract as ItemContractModel } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

export default class UserPrismaRepository implements ItemContractRepository {
  constructor(protected db: Omit<PrismaClient, runtime.ITXClientDenyList>) {}

  async create(contract: ItemContract): Promise<void> {
    const model = this.toModel(contract);
    await this.db.itemContract.create({
      data: model,
    });
  }

  async findById(id: ItemContractId): Promise<ItemContract | null> {
    const contract = await this.db.itemContract.findFirst({ where: { id } });

    if (!contract) {
      return null;
    }

    return this.fromModel(contract);
  }

  private fromModel({
    id, data, url, createdAt, updatedAt,
  }: ItemContractModel): ItemContract {
    return new ItemContractDomain(
      id,
      data,
      url,
      createdAt,
      updatedAt,
    );
  }

  private toModel(domain: ItemContract): ItemContractModel {
    return {
      id: domain.id,
      data: domain.data,
      url: domain.url,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
