import prismaClient from "../../prisma";

class ApplyCouponToActiveOrder {
  async execute(user_id: string, coupon: string) {
    const order = await prismaClient.orders.findFirst({
      where: {
        user_id,
        done: false,
      },
      include: {
        coupon: true,
      },
    });

    if (!order)
      throw {
        error: "Active order not found.",
        code: 404,
      };

    const discountCoupon = await prismaClient.discount.findFirst({
      where: {
        coupon,
      },
    });

    if (!discountCoupon) {
      if (order.coupon) {
        const orderValue = order.value / (1 - order.coupon.value / 100);

        const updatedOrder = await prismaClient.orders.update({
          where: {
            id: order.id,
          },
          data: {
            value: orderValue,
            appliedCoupon: null,
          },
        });
        return updatedOrder;
      }

      return order;
    }

    let orderValue: number;
    if (order.coupon)
      orderValue =
        (order.value / (1 - order.coupon.value / 100)) *
        (1 - discountCoupon.value / 100);
    else orderValue = order.value * (1 - discountCoupon.value / 100);

    const updatedOrder = await prismaClient.orders.update({
      where: {
        id: order.id,
      },
      data: {
        value: orderValue,
        appliedCoupon: discountCoupon.id,
      },
    });

    return updatedOrder;
  }
}

export { ApplyCouponToActiveOrder };
