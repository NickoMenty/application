import PinataClient, { PinataConfig } from '@pinata/sdk';

export default class StoragePinataRepository implements StorageRepository {
  private pinata: PinataClient;

  constructor(config: PinataConfig) {
    this.pinata = new PinataClient(config);
  }

  async upload(file: string) : Promise<string> {
    const metadata = JSON.parse(file);
    const response = await this.pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: metadata.name,
      },
    });

    return `https://ipfs.io/ipfs/${response.IpfsHash}`;
  }
}
