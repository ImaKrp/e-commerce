import prismaClient from "../../prisma";

interface IProduct {
  id: number;
  name: string;
  image: string;
  value: number;
}

interface ISize {
  id: number;
  name: string;
}

interface IOrderedProduct {
  id: number;
  product_id: number;
  order_id: number;
  quantity: number;
  size_id: number;
  product: IProduct;
  size: ISize;
}

const getProductsWithSizes = (products: IOrderedProduct[]) => {
  const result = products.map((product: IOrderedProduct) => ({
    quantity: product.quantity,
    ...product.product,
    size: product.size.name,
  }));
  return result;
};

class GetActiveOrdersService {
  async execute(user_id: number) {
    try {
      const userOrder = await prismaClient.orders.findFirst({
        where: {
          user_id: user_id,
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

      delete userOrder.user_id;

      const orders = getProductsWithSizes(userOrder.ordered_products);

      delete userOrder.ordered_products;

      return { ...userOrder, products: orders };
    } catch (error) {
      throw {
        error: "Active order not found.",
        code: 404,
      };
    }
  }
}

export { GetActiveOrdersService };
