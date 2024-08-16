export default class GetUser implements GetUserInPort {
  constructor(
    protected presenter: GetUserOutPort,
    protected userRepo: UserRepository,
  ) {}

  async execute({ id, email }: GetUserIn): Promise<void> {
    this.presenter.present({
      user: await this.userRepo.findOne({ id, email }),
    });
  }
}
