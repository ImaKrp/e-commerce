import prismaClient from "../../prisma";
import bcrypt from "bcrypt";

interface IData {
  email?: string;
  password?: string;
  name?: string;
  adress?: string;
  phone?: string;
  last_name?: string;
}

class UpdateUserService {
  async execute(
    user_id: string,
    email?: string,
    password?: string,
    name?: string,
    adress?: string,
    phone?: string,
    lastName?: string
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    let data: IData = {};
    email && (data.email = email);
    password && (data.password = hashedPassword);
    name && (data.name = name);
    lastName && (data.last_name = lastName);
    adress && (data.last_name = adress);
    phone && (data.last_name = phone);

    if (email) {
      const user = await prismaClient.user.findFirst({
        where: {
          email: email,
        },
      });
      if (user && user.id !== user_id) {
        throw {
          error: { field: "email", message: "E-mail já cadastrado." },
          code: 400,
        };
      }
    }

    const user = await prismaClient.user.update({
      where: {
        id: user_id,
      },
      data: {
        ...data,
      },
    });

    delete user.password;
    delete user.id;
    return user;
  }
}

export { UpdateUserService };
