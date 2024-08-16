import { PrismaClient, User as UserModel } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import UserDomain from '@/domains/UserDomain';

export default class UserPrismaRepository implements UserRepository {
  constructor(protected db: Omit<PrismaClient, runtime.ITXClientDenyList>) {}

  async create(data: CreateUserDto): Promise<User> {
    return this.fromModel(await this.db.user.create({
      data: {
        ...data,
        address: Buffer.from(data.address),
        privateKey: Buffer.from(data.privateKey),
      },
    }));
  }

  async findOne(where: { id: number }): Promise<User | null> {
    const user = await this.db.user.findFirst({ where });

    if (!user) {
      return null;
    }

    return this.fromModel(user);
  }

  private fromModel({
    id,
    email,
    firstName,
    lastName,
    password,
    address,
    mnemonic,
    privateKey,
    createdAt,
    updatedAt,
    deletedAt,
  }: UserModel): User {
    return new UserDomain(
      id,
      email as Email,
      firstName,
      lastName,
      password,
      address.toString(),
      mnemonic,
      privateKey.toString(),
      createdAt,
      updatedAt,
      deletedAt || undefined,
    );
  }

  private toModel(domain: User): UserModel {
    return {
      id: domain.id,
      email: domain.email,
      firstName: domain.firstName,
      lastName: domain.lastName,
      password: domain.password,
      address: Buffer.from(domain.address),
      mnemonic: domain.mnemonic,
      privateKey: Buffer.from(domain.privateKey),
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      deletedAt: domain.deletedAt || null,
    };
  }
}
