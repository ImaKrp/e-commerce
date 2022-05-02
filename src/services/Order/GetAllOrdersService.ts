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
  product?: IProduct;
  size?: ISize;
}

interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  last_name: string;
  permission: string;
}

interface IOrder {
  id: number;
  value: number;
  user_id: number;
  done: boolean;
  created_at: Date;
  ordered_products: IOrderedProduct[];
  user?: IUser;
}

const getProductsWithSizes = (products: IOrderedProduct[]) => {
  const result = products.map((product: IOrderedProduct) => ({
    quantity: product.quantity,
    ...product.product,
    size: product.size.name,
  }));
  return result;
};

class GetAllOrdersService {
  async execute(user_id: number, isAdmin?: boolean) {
    if (isAdmin) {
      const allOrders = await prismaClient.orders.findMany({
        include: {
          ordered_products: {
            include: {
              product: true,
              size: true,
            },
          },
          user: true,
          coupon: true,
        },
      });

      allOrders.map((order: IOrder) => {
        delete order.user_id;
        delete order.user.password;
      });

      const filteredOrder = allOrders.map((userOrder: IOrder) => {
        const orders = getProductsWithSizes(userOrder.ordered_products);

        delete userOrder.ordered_products;

        return { ...userOrder, products: orders };
      });

      return filteredOrder;
    }

    const userOrders = await prismaClient.orders.findMany({
      where: {
        user_id: user_id,
      },
      include: {
        ordered_products: {
          include: {
            product: true,
            size: true,
          },
        },
      },
    });

    const filteredOrder = userOrders.map((userOrder: IOrder) => {
      delete userOrder.user_id;

      const orders = getProductsWithSizes(userOrder.ordered_products);

      delete userOrder.ordered_products;

      return { ...userOrder, products: orders };
    });

    return filteredOrder;
  }
}

export { GetAllOrdersService };
