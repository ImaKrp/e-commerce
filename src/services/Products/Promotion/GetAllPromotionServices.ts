import prismaClient from "../../../prisma";

class GetAllPromotionServices {
  async execute() {
    const promotion = await prismaClient.promotion.findMany();

    return promotion;
  }
}

export { GetAllPromotionServices };
