import bcrypt from 'bcryptjs';
import { z, ZodIssueCode } from 'zod';

const Unauthorized = new z.ZodError([{
  code: ZodIssueCode.custom,
  path: ['password'],
  message: 'The password are incorrect.',
}]);

export default class SignIn implements SignInInPort {
  constructor(
    protected presenter: SignInOutPort,
    protected userRepo: UserRepository,
  ) {}

  async execute({ email, password }: SignInIn): Promise<void> {
    const user = await this.userRepo.findOne({ email });

    if (!user) {
      throw Unauthorized;
    }

    if (await !bcrypt.compareSync(password, user.password)) {
      throw Unauthorized;
    }

    this.presenter.present({ user });
  }
}
