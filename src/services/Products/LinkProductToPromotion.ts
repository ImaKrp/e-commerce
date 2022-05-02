import prismaClient from "../../prisma";

class LinkProductToPromotion {
  async execute(product_id: string, promotion_id: number) {
    const product = await prismaClient.product.findFirst({
      where: { id: product_id },
      include: { promotion: true },
    });

    if (!product) {
      throw {
        error: "Product not found.",
        code: 404,
      };
    }

    const promotion = await prismaClient.promotion.findFirst({
      where: { id: promotion_id },
    });

    if (!promotion_id || !promotion) {
      if (product.promotion) {
        const value = product.value / (1 - product.promotion.value / 100);
        await prismaClient.product.update({
          where: { id: product.id },
          data: {
            value,
          },
        });
      }
      await prismaClient.product.update({
        where: { id: product.id },
        data: {
          promotionId: null,
        },
      });
    } else {
      const value = product.promotion
        ? (product.value / (1 - product.promotion.value / 100)) *
          (1 - promotion.value / 100)
        : product.value * 1 - promotion.value / 100;

      await prismaClient.product.update({
        where: { id: product.id },
        data: {
          value,
          promotionId: promotion.id,
        },
      });
    }
  }
}

export { LinkProductToPromotion };
