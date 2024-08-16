interface UseCaseInPort<In> {
  execute(req: In): Promise<void> | void;
}
interface UseCaseOutPort<Out> {
  present(out: Out): Promise<void> | void;
}

type CreateUserIn = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
type CreateUserOut = {
  user: User;
};
type CreateUserInPort = UseCaseInPort<CreateUserIn>;
type CreateUserOutPort = UseCaseOutPort<CreateUserOut>;

type GetUserIn = UserFilters;
type GetUserOut = {
  user: User | null;
};
type GetUserInPort = UseCaseInPort<GetUserIn>;
type GetUserOutPort = UseCaseOutPort<GetUserOut>;

type SignInIn = {
  email: Email;
  password: string;
};
type SignInOut = {
  user: User;
};
type SignInInPort = UseCaseInPort<SignInIn>;
type SignInOutPort = UseCaseOutPort<SignInOut>;

type CreateItemIn = {
  title: string;
  price: number;
  description: string;
  userId: UserId;
  files: File[]
};
type CreateItemOut = {
  item: Item;
};
type CreateItemInPort = UseCaseInPort<CreateItemIn>;
type CreateItemOutPort = UseCaseOutPort<CreateItemOut>;

type BuyItemIn = {
  itemId: ItemId;
  userId: UserId;
};
type BuyItemOut = {
  tx: string;
};
type BuyItemInPort = UseCaseInPort<BuyItemIn>;
type BuyItemOutPort = UseCaseOutPort<BuyItemOut>;

type UpdateItemIn = {
  id: ItemId;
  title: string;
  price: number;
  description: string;
  userId: UserId;
  files: File[]
};
type UpdateItemOut = {
  item: Item;
};
type UpdateItemInPort = UseCaseInPort<UpdateItemIn>;
type UpdateItemOutPort = UseCaseOutPort<UpdateItemOut>;

type DeleteItemIn = {
  id: ItemId;
  userId: UserId;
};
type DeleteItemOut = {
  status: boolean;
};
type DeleteItemInPort = UseCaseInPort<DeleteItemIn>;
type DeleteItemOutPort = UseCaseOutPort<DeleteItemOut>;

type GetItemIn = {
  id: ItemId
};
type GetItemOut = {
  item: Item | null;
};
type GetItemInPort = UseCaseInPort<GetItemIn>;
type GetItemOutPort = UseCaseOutPort<GetItemOut>;

type GetItemsIn = {
  userId?: UserId;
  customerId?: UserId | null
};
type GetItemsOut = {
  items: Item[];
};
type GetItemsInPort = UseCaseInPort<GetItemsIn>;
type GetItemsOutPort = UseCaseOutPort<GetItemsOut>;

type GetTokenUriIn = {
  itemId: ItemId;
  userId: UserId;
  password: string;
};
type GetTokenUriOut = {
  uri: string;
};
type GetTokenUriInPort = UseCaseInPort<GetTokenUriIn>;
type GetTokenUriOutPort = UseCaseOutPort<GetTokenUriOut>;

type GetItemContractIn = {
  id: ItemContractId
};
type GetItemContractOut = {
  contract: ItemContract | null;
};
type GetItemContractInPort = UseCaseInPort<GetItemContractIn>;
type GetItemContractOutPort = UseCaseOutPort<GetItemContractOut>;
