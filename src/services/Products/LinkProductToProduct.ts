import prismaClient from "../../prisma";

interface ILink {
  product_id: number;
  variant: string;
}

class LinkProductToProduct {
  async execute(products: ILink[], id?: number) {
    let products_link = null;
    if (id) {
      products_link = await prismaClient.productsLink.findUnique({
        where: {
          id,
        },
      });
    }
    
    if (!id || !products_link) {
      for (const product of products) {
        const productFromDb = await prismaClient.product.findFirst({
          where: {
            id: product.product_id,
          },
        });
        if (productFromDb.products_link_id)
          products_link = await prismaClient.productsLink.findUnique({
            where: {
              id: productFromDb.products_link_id,
            },
          });
        if (products_link) break;
      }
    }
    if (products_link) {
      for (const product of products) {
        await prismaClient.product.update({
          where: {
            id: product.product_id,
          },
          data: {
            products_link_id: products_link.id,
            variation: product.variant,
          },
        });
      }
    } else {
      const newLink = await prismaClient.productsLink.create({
        data: {},
      });
      for (const product of products) {
        await prismaClient.product.update({
          where: {
            id: product.product_id,
          },
          data: {
            products_link_id: newLink.id,
            variation: product.variant,
          },
        });
      }
    }
  }
}

export { LinkProductToProduct };
