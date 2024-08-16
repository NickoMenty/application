import {Contract, ethers, EventLog, JsonRpcProvider} from 'ethers';
import { ContractEvent, PrismaClient } from '@prisma/client';
import abi from './abi.json';

type Address = string;

type ContractEventId = number;

type CreateContractEventDto = {
  address: Address;
  event: string;
  blockNumber: number;
  txHash: string;
  txIndex: number;
  logIndex: number;
  eventSignature: string;
  state: number;
  args: unknown[];
};

type ContractEventModel = {
  id: number;
  address: string;
  blockNumber: number;
  txHash: string;
  txIndex: number;
  logIndex: number;
  event: string;
  eventSignature: string;
  state: number;
  args: unknown[];
};

enum Events {
  NftMinted = 'NftMinted',
}

type NftMintedEventArgs = [number, string, string, bigint, string];

const prisma = new PrismaClient();
const provider = new JsonRpcProvider(process.env.RPC_PROVIDER);
const contract = new Contract(process.env.CONTRACT as string, abi, provider);

async function getLatestBlockNumber(address: string): Promise<number> {
  const result = await prisma.contractEvent.findFirst({
    where: {
      address,
    },
    orderBy: {
      blockNumber: 'desc',
    },
  });

  if (!result) {
    return 1;
  }

  return Number(result.blockNumber);
}

async function existEvent(
  address: Address,
  event: string,
  logIndex: number,
  txHash: string,
): Promise<boolean> {
  const count = await prisma.contractEvent.count({
    where: {
      address,
      event,
      logIndex,
      txHash,
    },
  });

  return count > 0;
}

async function createEvent(contractEvent: CreateContractEventDto): Promise<ContractEvent> {
  return prisma.contractEvent.create({
    data: {
      ...contractEvent,
      args: JSON.stringify(
        contractEvent.args,
        (key, value) => (typeof value === 'bigint' ? `${value}n` : value)
      )
    },
  });
}

async function handleEvent(eventLog: EventLog) {
  if (await existEvent(eventLog.address, eventLog.fragment.name, eventLog.index, eventLog.transactionHash)) {
    return;
  }

  const createContractEventDto = {
    address: eventLog.address,
    event: eventLog.fragment.name,
    blockNumber: eventLog.blockNumber,
    txHash: eventLog.transactionHash,
    txIndex: eventLog.transactionIndex,
    logIndex: eventLog.index,
    eventSignature: eventLog.eventSignature,
    state: 0,
    args: eventLog.args,
  };
  const event = await createEvent(createContractEventDto);

  switch (createContractEventDto.event) {
    case Events.NftMinted: {
      const [tokenId, recipient, tokenURI, mintFee, withdrawAddress] = createContractEventDto.args as unknown as NftMintedEventArgs;
      const customer = await prisma.user.findFirst({
        where: {
          address: Buffer.from(recipient),
        },
      });

      if (!customer) {
        return;
      }

      const seller = await prisma.user.findFirst({
        where: {
          address: Buffer.from(withdrawAddress),
        },
      });

      if (!seller) {
        return;
      }

      const data = await fetch(tokenURI);
      const {item_id, contract_id} = await data.json();

      const item = await prisma.item.findFirst({
        where: {
          id: Number(item_id),
          customerId: null,
        }
      });

      if (!item) {
        return;
      }

      await Promise.all([
        prisma.item.update({
          where: { id: item.id },
          data: { customerId: customer.id, contractId: contract_id },
        }),
        prisma.transfer.create({
          data: {
            from: customer.id,
            to: seller.id,
            itemId: item.id,
            amount: ethers.formatEther(BigInt(1000000000000)),
          }
        }),
        prisma.contractEvent.update({
          where: {
            id: event.id,
          },
          data: {
            state: 1
          }
        }),
      ]);
      const transfers = await prisma.transfer.findMany({
        where: {
          OR: [
            { from: seller.id },
            { to: seller.id },
          ]
        }
      })

      let balance = 0;
      for (const transfer of transfers) {
        if (transfer.to === seller.id) balance += Number(transfer.amount);
      }
      await prisma.user.update({
        where: {
          id: seller.id,
        },
        data: {
          balance: balance.toString(),
        },
      })

      break;
    }
    default:
      console.warn('cannot handle event:', createContractEventDto.event);
  }
}

async function listen(blockNumber: number) {
  const latestBlockNumber = await getLatestBlockNumber(await contract.getAddress());

  if (latestBlockNumber < blockNumber) {
    const events = await contract.queryFilter(
      Events.NftMinted,
      latestBlockNumber,
      blockNumber,
    );
    await Promise.all(events.map(handleEvent));
  }

  await contract.on(Events.NftMinted, (...args) => {
    const [,,,,,event] = args;
    handleEvent(event.log)
  });
}

(async () => {
  await prisma.$connect();
  listen(await provider.getBlockNumber());
})();
