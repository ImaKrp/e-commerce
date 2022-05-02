import prismaClient from "../../prisma";

interface ICategory {
  id: number;
  name: string;
}

interface ICategories {
  id: number;
  category_id: number;
  product_id: number;
  category: ICategory;
}

interface ISize {
  id: number;
  name: string;
}

interface IQuantity {
  id: number;
  size_id: number;
  quantity: number;
  product_id: number;
  size: ISize;
}

interface IProductFromLink {
  id: number;
  name: string;
  description: string;
  image: string;
  variation: string;
  value: number;
  promotion_id: number | null;
  products_link_id: number;
  quantity?: IQuantity[];
}

interface IProductLink {
  id: number;
  product: IProductFromLink[];
}

interface IProduct {
  id: number;
  name: string;
  image: string;
  value: number;
  promotion_id: number;
  products_link_id: number | null;
  products_link?: IProductLink;
  quantity?: IQuantity[];
  categories?: ICategories[];
}

const getProductWithSizes = (product: IProduct) => {
  const sizes = product.quantity.map((quantity: IQuantity) => ({
    size_id: quantity.size_id,
    size: quantity.size.name,
    quantity: quantity.quantity,
  }));

  const categories = product.categories.map(
    (category: ICategories) => category.category
  );

  delete product.quantity;
  delete product.categories;
  delete product.promotion_id;
  delete product.products_link_id;

  if (product?.products_link?.product) {
    const linkedProducts = product.products_link.product
      .filter((item) => item.id !== product.id && item.quantity.length > 0)
      .map((item) => {
        delete item.quantity;
        delete item.products_link_id;
        return item;
      });

    delete product.products_link;
    return {
      ...product,
      quantities: sizes,
      categories,
      linked_products: linkedProducts,
    };
  }

  return {
    ...product,
    quantities: sizes,
    categories,
  };
};

class GetProductFromIdServices {
  async execute(product_id: number) {
    const productFromDB = await prismaClient.product.findFirst({
      where: {
        id: product_id,
      },
      include: {
        promotion: true,
        products_link: {
          include: {
            product: {
              include: {
                quantity: {
                  include: {
                    size: true,
                  },
                },
              },
            },
          },
        },
        quantity: {
          include: {
            size: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!productFromDB)
      throw {
        error: "Product not found.",
        code: 404,
      };

    const productWithSizes = getProductWithSizes(productFromDB);

    return productWithSizes;
  }
}

export { GetProductFromIdServices };
