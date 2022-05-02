import prismaClient from "../../prisma";

interface IProducts {
  product_id: number;
  size_id: number;
}

class DeleteFromActiveOrder {
  async execute(user_id: number, products: IProducts[]) {
    const order = await prismaClient.orders.findFirst({
      where: {
        user_id,
        done: false,
      },
      include: {
        ordered_products: {
          include: {
            product: true,
            size: true,
          },
        },
        coupon: true,
      },
    });

    if (!order)
      throw {
        error: "Active order not found.",
        code: 404,
      };

    let orderValue = order.coupon
      ? order.value / (1 - order.coupon.value / 100)
      : order.value;

    for (const product of products) {
      const orderedProduct = await prismaClient.orderedProducts.findFirst({
        where: {
          order_id: order.id,
          product_id: product.product_id,
          size_id: product.size_id,
        },
        include: {
          product: true,
          size: {
            include: {
              quantity: true,
            },
          },
        },
      });

      if (orderedProduct) {
        const productValue =
          orderedProduct.quantity * orderedProduct.product.value;

        await prismaClient.orderedProducts.delete({
          where: {
            id: orderedProduct.id,
          },
        });

        const prevQuantity = await prismaClient.quantity.findFirst({
          where: {
            product_id: product.product_id,
            size_id: product.size_id,
          },
        });

        if (!prevQuantity) {
          await prismaClient.quantity.create({
            data: {
              product_id: product.product_id,
              size_id: product.size_id,
              quantity: orderedProduct.quantity,
            },
          });
        } else {
          await prismaClient.quantity.update({
            where: {
              id: prevQuantity.id,
            },
            data: {
              quantity: prevQuantity.quantity + orderedProduct.quantity,
            },
          });
        }

        orderValue -= productValue;
      } else {
        throw {
          error: "Product not found.",
          code: 404,
        };
      }
    }

    orderValue = order.coupon
      ? orderValue * (1 - order.coupon.value / 100)
      : orderValue;

    const updatedOrder = await prismaClient.orders.update({
      where: {
        id: order.id,
      },
      data: {
        value: orderValue,
      },
    });

    return updatedOrder;
  }
}

export { DeleteFromActiveOrder };
