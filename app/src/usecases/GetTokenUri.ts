import ItemContractDomain from '@/domains/ItemContractDomain';
import crypto from 'node:crypto';
import { z } from 'zod';

const HARDCODED_IMAGE = 'ipfs://QmcLEDJtHNw2How2SkmDxWpvKSa5aNDiTkR3PiikCNDaty';
const IV = crypto.randomBytes(16);

export default class GetTokenUri implements GetTokenUriInPort {
  constructor(
    protected presenter: GetTokenUriOutPort,
    protected itemRepo: ItemRepository,
    protected userRepo: UserRepository,
    protected storageRepo: StorageRepository,
    protected itemContractRepo: ItemContractRepository,
  ) {}

  async execute({ itemId, userId, password }: GetTokenUriIn): Promise<void> {
    z.object({
      itemId: z.number().min(1),
      userId: z.number().min(1),
    }).parse({ itemId, userId });

    const user = await this.userRepo.findOne({ id: userId });
    if (!user) throw new Error('User does not exists');

    const item = await this.itemRepo.item({ id: itemId });
    if (!item) throw new Error('Item does not exists');

    const date = new Date();

    const data = this.encrypt(JSON.stringify({
      name: `Rental Info ${item.id}`,
      description: `I am ${user.firstName} ${user.lastName} renting this space at the date: ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} with a price ${item.price} ETH`,
    }), password);
    const contractId = crypto.createHash('sha256').update(data).digest('hex');
    const contract = await this.itemContractRepo.findById(contractId);
    if (contract) {
      this.presenter.present({ uri: contract.url });
      return;
    }

    const contractUrl = await this.storageRepo.upload(JSON.stringify({
      name: `Rental Info ${item.id}`,
      image: HARDCODED_IMAGE,
      item_id: item.id,
      contract_id: contractId,
    }));

    const newContract = new ItemContractDomain(
      contractId,
      data,
      contractUrl,
      new Date(),
      new Date(),
    );
    await this.itemContractRepo.create(newContract);

    this.presenter.present({ uri: contractUrl });
  }

  private encrypt(text: string, password: string) {
    const key = crypto.scryptSync(password, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${IV.toString('hex')}:${encrypted}`; // Prepend IV for decryption
  }
}
