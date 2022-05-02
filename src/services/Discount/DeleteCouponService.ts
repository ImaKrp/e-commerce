import prismaClient from "../../prisma";

class DeleteCouponService {
  async execute(id: number) {
    if (!Number.isInteger(id)) {
      throw {
        error: "Invalid coupon ID.",
        code: 400,
      };
    }

    try {
      await prismaClient.discount.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw {
        error: "coupon not found.",
        code: 404,
      };
    }
  }
}

export { DeleteCouponService };
