import prismaClient from "../../prisma";

interface ICategory {
  id: number;
  name: string;
}

interface ICategories {
  id: number;
  category_id: number;
  product_id: string;
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

interface IFilteredQuantities {
  size_id: number;
  size: string;
  quantity: number;
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
  promotion_id: number | null;
  products_link_id: number | null;
  products_link?: IProductLink;
  quantity?: IQuantity[];
  categories?: ICategories[];
}

interface IFilteredProduct {
  id: number;
  name: string;
  image: string;
  value: number;
  promotion_id: number;
  quantities?: IFilteredQuantities[];
  categories?: ICategory[];
}

const getProductsWithSizes = (products: IProduct[]) => {
  const result = products.map((product: IProduct) => {
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

    return {
      ...product,
      quantities: sizes,
      categories,
    };
  });

  return result;
};

class GetAllTransactionsServices {
  async execute(
    sizeFilter?: number,
    categoryFilter?: any,
    maxValue?: number,
    isAdmin?: boolean
  ) {
    let filterData: any = {
      where: undefined,
      include: {
        promotion: true,
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
    };

    sizeFilter &&
      (filterData.include.quantity = {
        where: {
          size_id: sizeFilter,
        },
        include: {
          size: true,
        },
      });

    maxValue &&
      (filterData.where = {
        value: {
          lt: maxValue,
        },
      });

    if (categoryFilter && Number(categoryFilter)) {
      filterData.include.categories = {
        where: {
          category_id: Number(categoryFilter),
        },
        include: {
          category: true,
        },
      };
    } else if (categoryFilter && !Number(categoryFilter)) {
      const categoriesFilters = categoryFilter.map((category: string) =>
        Number(category)
      );

      const result = [];

      for (const categoryFilter of categoriesFilters) {
        filterData.include.categories = {
          where: {
            category_id: categoryFilter,
          },
          include: {
            category: true,
          },
        };

        const products = await prismaClient.product.findMany(filterData);
        const resultIds = [
          ...new Set(
            result
              .filter(
                (product: IFilteredProduct) =>
                  product?.quantities?.length > 0 &&
                  product?.categories?.length > 0
              )
              .map(({ id }) => id)
          ),
        ];

        products.map((product: any) => {
          if (!resultIds.includes(product.id)) {
            const productWithSizes: any = getProductsWithSizes([product]);
            result.push(...productWithSizes);
          }
        });
      }

      return result.filter(
        (product: IFilteredProduct) =>
          product?.quantities?.length > 0 && product?.categories?.length > 0
      );
    }

    const products = await prismaClient.product.findMany(filterData);

    const productsWithSizes = getProductsWithSizes(products);

    if (isAdmin && !categoryFilter && !sizeFilter) {
      return productsWithSizes;
    }

    return productsWithSizes.filter(
      (product: IFilteredProduct) => product?.quantities?.length > 0
    );
  }
}

export { GetAllTransactionsServices };
