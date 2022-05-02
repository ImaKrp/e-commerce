import prismaClient from "../../prisma";
import bcrypt from "bcrypt";

interface ISubmitData {
  email: string;
  password: string;
  name: string;
  adress: string;
  phone: string;
  last_name?: string;
}

class CreateUserService {
  async execute(
    email: string,
    password: string,
    name: string,
    adress: string,
    phone: string,
    lastName?: string
  ) {
    let user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      throw {
        error: { field: "email", message: "E-mail já cadastrado." },
        code: 400,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      const data: ISubmitData = {
        email,
        password: hashedPassword,
        name,
        adress,
        phone,
      };
      if (lastName) data.last_name = lastName;

      user = await prismaClient.user.create({
        data,
      });
    }

    delete user.password;
    delete user.id;
    return user;
  }
}

export { CreateUserService };
