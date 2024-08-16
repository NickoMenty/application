type Email = `${string}@${string}.${string}`;
type CreatedAt = Date;
type UpdatedAt = Date;
type DeletedAt = Date;

type CreateUserDto = {
  email: Email;
  firstName: string;
  lastName: string;
  password: string;
  address: string;
  mnemonic: string;
  privateKey: string;
};

type UserId = number;

interface User {
  id: UserId;
  email: Email;
  firstName: string;
  lastName: string;
  password: string;
  address: string;
  mnemonic: string;
  privateKey: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: DeletedAt;
}

type ItemId = number;

interface Item {
  id: ItemId;
  title: string;
  price: number;
  description: string;
  userId: UserId;
  customerId: UserId | null;
  contractId: ItemContractId | null;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: DeletedAt;

  files: FileDto[];
}

type CreateItemDto = {
  title: string;
  price: number;
  description: string;
  userId: UserId;
};

type UpdateItemDto = {
  id: ItemId;
  title: string;
  price: number;
  description: string;
  userId: UserId;
};

type FileId = number;

interface CreateFileDto {
  name: string;
  entity: string;
  entityId: number;
}

interface FileDto {
  id: FileId;
  path: string;
  entity: string;
  entityId: number;
  createdAt: CreatedAt;
}

type ItemContractId = string;

interface ItemContract {
  id: ItemContractId;
  data: string;
  url: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}
