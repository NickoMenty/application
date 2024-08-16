import prisma from '@/lib/prisma';
import UserPrismaRepository from '@/repositories/UserPrismaRepository';
import ItemPrismaRepository from '@/repositories/ItemPrismaRepository';
import StoragePinataRepository from '@/repositories/StoragePinataRepository';
import FilePrismaRepository from '@/repositories/FilePrismaRepository';
import ItemContractPrismaRepository from '@/repositories/ItemContractPrismaRepository';

export const userRepo: UserRepository = new UserPrismaRepository(prisma);
export const itemRepo: ItemRepository = new ItemPrismaRepository(prisma);
export const storageRepo: StorageRepository = new StoragePinataRepository({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_KEY,
});
export const fileRepo: FileRepository = new FilePrismaRepository(prisma);
export const itemContractRepo: ItemContractRepository = new ItemContractPrismaRepository(prisma);

export default {
  userRepo,
  itemRepo,
  storageRepo,
  fileRepo,
  itemContractRepo,
};
