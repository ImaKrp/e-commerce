import prismaClient from "../../prisma";

class CreateCouponService {
  async execute(couponName: string, value: number) {
    try {
      const coupon = await prismaClient.discount.create({
        data: {
          coupon: couponName,
          value,
        },
      });

      return coupon;
    } catch (e) {
      throw {
        error: "Coupon already registered.",
        code: 400,
      };
    }
  }
}

export { CreateCouponService };
