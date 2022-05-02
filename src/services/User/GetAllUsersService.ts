import prismaClient from "../../prisma";
import bcrypt from "bcrypt";

class GetAllUsersService {
  async execute() {
    const users = await prismaClient.user.findMany();

    users.map((item) => {
      delete item.password;
    });

    return users;
  }
}

export { GetAllUsersService };
