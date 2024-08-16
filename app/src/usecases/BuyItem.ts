import crypto from 'node:crypto';
import { z } from 'zod';
import {
  JsonRpcProvider, Wallet, Contract, parseEther,
} from 'ethers';
import abi from './abi.json';

const PASSWORD = 'easy';
const HARDCODED_IMAGE = 'ipfs://QmcLEDJtHNw2How2SkmDxWpvKSa5aNDiTkR3PiikCNDaty';
const IV = crypto.randomBytes(16);

export default class BuyItem implements BuyItemInPort {
  constructor(
    protected presenter: BuyItemOutPort,
    protected itemRepo: ItemRepository,
    protected userRepo: UserRepository,
    protected storageRepo: StorageRepository,
  ) {}

  async execute({ itemId, userId }: BuyItemIn): Promise<void> {
    z.object({
      itemId: z.number().min(1),
      userId: z.number().min(1),
    }).parse({ itemId, userId });

    const user = await this.userRepo.findOne({ id: userId });
    if (!user) throw new Error('User does not exists');

    const item = await this.itemRepo.item({ id: itemId });
    if (!item) throw new Error('Item does not exists');

    const owner = await this.userRepo.findOne({ id: item.userId });
    if (!owner) throw new Error('Owner does not exists');

    const provider = new JsonRpcProvider(process.env.RPC_PROVIDER);
    const signer = new Wallet(process.env.CONTRACT_OWNER || '', provider);
    const contract = new Contract(process.env.CONTRACT || '', abi, signer);

    const date = new Date();

    const ipfsUri = await this.storageRepo.upload(JSON.stringify({
      name: `Rental Info ${item.id}`,
      description: `I am ${user.firstName} ${user.lastName} renting this space at the date: ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} with a price ${item.price} ETH`,
    }));

    // Encrypt the IPFS URI
    const encryptedIpfsUri = this.encrypt(ipfsUri);

    const finalIpfsUri = await this.storageRepo.upload(JSON.stringify({
      name: `Rental Info ${item.id}`,
      image: HARDCODED_IMAGE,
      contract_id: encryptedIpfsUri,
    }));

    const mintFee = '0.0001';

    const tx = await contract.mintNft(
      finalIpfsUri,
      parseEther(mintFee),
      owner.address,
      user.address,
      { value: parseEther(mintFee) },
    );

    this.presenter.present({ tx: tx.hash });
  }

  private encrypt(text: string) {
    const key = crypto.scryptSync(PASSWORD, 'salt', 32); // Derive a key from the password
    const cipher = crypto.createCipheriv('aes-256-cbc', key, IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${IV.toString('hex')}:${encrypted}`; // Prepend IV for decryption
  }
}
