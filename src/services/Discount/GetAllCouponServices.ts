import prismaClient from "../../prisma";

class GetAllCouponServices {
  async execute() {
    const coupon = await prismaClient.discount.findMany();

    return coupon;
  }
}

export { GetAllCouponServices };
