import { z, ZodIssueCode } from 'zod';
import bcrypt from 'bcryptjs';
import { ethers } from 'ethers';
import { Prisma } from '@prisma/client';

export default class CreateUser implements CreateUserInPort {
  constructor(
    protected presenter: CreateUserOutPort,
    protected userRepo: UserRepository,
  ) {}

  async execute({
    firstName, lastName, email, password,
  }: CreateUserIn): Promise<void> {
    z.object({
      firstName: z.string({ required_error: 'The first name is required' }).trim().min(1),
      lastName: z.string({ required_error: 'The last name is required' }).trim().min(1),
      email: z.string().trim().email(),
      password: z.string().trim().min(8),
    }).parse({
      firstName, lastName, email, password,
    });

    if (await this.userRepo.findOne({ email: email as Email })) {
      throw new z.ZodError([{
        code: ZodIssueCode.custom,
        path: ['email'],
        message: 'The email already exists',
      }]);
    }

    const wallet = ethers.Wallet.createRandom();

    try {
      const user = await this.userRepo.create({
        firstName,
        lastName,
        email: email as Email,
        password: await bcrypt.hash(password, 5),
        address: wallet.address,
        mnemonic: wallet.mnemonic?.phrase as string,
        privateKey: wallet.privateKey,
      });

      this.presenter.present({ user });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          const [target] = e.meta?.target as Array<string>;
          throw new z.ZodError([{
            code: ZodIssueCode.custom,
            path: [target],
            message: `The ${target} already exists`,
          }]);
        }
      }
      throw e;
    }
  }
}
