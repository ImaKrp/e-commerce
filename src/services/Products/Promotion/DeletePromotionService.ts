import prismaClient from "../../../prisma";

class DeletePromotionService {
  async execute(id: number) {
    if (!Number.isInteger(id)) {
      throw {
        error: "Invalid promotion ID.",
        code: 400,
      };
    }

    try {
      await prismaClient.promotion.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw {
        error: "Promotion not found.",
        code: 404,
      };
    }
  }
}

export { DeletePromotionService };
