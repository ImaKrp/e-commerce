import prismaClient from "../../../prisma";
import nodemailer from "nodemailer";

class RequestPasswordRecovery {
  async execute(email: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw {
        error: { field: "email", message: "Conta não encontrada." },
        code: 400,
      };
    }

    const recovery = await prismaClient.passwordRecovery.create({
      data: {
        email,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "imakrp",
        pass: "Julio1453",
      },
    });

    await transporter.sendMail({
      from: '"ImaKrp" <imakrp@gmail.com>',
      to: user.email,
      subject: "Recuperação de conta R O A N A",
      text: `http://localhost:8000/recover/${recovery.id}`,
    });

    return {
      message: "Verifique seu E-mail",
    };
  }
}

export { RequestPasswordRecovery };
