type SortOrder = 'asc' | 'desc';

type UserFilters = {
  id?: UserId;
  email?: Email;
};

interface UserRepository {
  create(user: CreateUserDto): Promise<User>;
  findOne(filter: UserFilters): Promise<User | null>
}

interface StorageRepository {
  upload(file: string): Promise<string>;
}

type ItemFilters = {
  id?: ItemId;
  userId?: UserId;
  customerId?: UserId | null;
};

interface ItemRepository {
  list(filters: ItemFilters): Promise<Item[]>;
  create(item: CreateItemDto): Promise<Item>;
  update(item: UpdateItemDto): Promise<Item>;
  item(filters: ItemFilters): Promise<Item | null>;
  delete(id: ItemId): Promise<void>;
}

type FileFilters = {
  id?: FileId;
  entity: string;
  entityId: number;
};

interface FileRepository {
  list(filters: FileFilters): Promise<FileDto[]>;
  create(file: File, options: CreateFileDto): Promise<void>;
  delete(id: FileId): Promise<void>;
}

interface ItemContractRepository {
  create(contract: ItemContract): Promise<void>;
  findById(id: ItemContractId): Promise<ItemContract | null>
}
