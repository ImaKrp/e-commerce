import prismaClient from "../../../prisma";

class CreatePromotionService {
  async execute(value: number) {
    try {
      const promotion = await prismaClient.promotion.create({
        data: {
          value,
        },
      });

      return promotion;
    } catch (e) {
      throw {
        error: "Promotion already registered.",
        code: 400,
      };
    }
  }
}

export { CreatePromotionService };
