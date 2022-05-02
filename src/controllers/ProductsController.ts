import { Request, Response } from "express";
import { CreateProductService } from "../services/Products/CreateProductService";
import { GetAllTransactionsServices } from "../services/Products/GetAllProductServices";
import { DeleteProductService } from "../services/Products/DeleteProductService";
import { LinkProductToCategory } from "../services/Products/LinkProductToCategory";
import { LinkProductToSize } from "../services/Products/LinkProductToSize";
import { LinkProductToProduct } from "../services/Products/LinkProductToProduct";
import { LinkProductToPromotion } from "../services/Products/LinkProductToPromotion";
import { UpdateProductService } from "../services/Products/UpdateProductService";
import { GetProductFromIdServices } from "../services/Products/GetProductFromIdServices";

class ProductsController {
  async create(req: Request, res: Response) {
    const { name, value, image, description, quantities, categories } =
      req.body;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const errors: String[] = [];
      !name && errors.push("name");
      !value && errors.push("value");
      !image && errors.push("image");

      if (errors.length !== 0) {
        return res.status(400).json({
          error:
            errors.length === 1
              ? `Field is required: ${errors[0]}`
              : `Fields are required: ${errors.join(", ")}`,
        });
      }

      const service = new CreateProductService();

      try {
        const result = await service.execute(
          name,
          value,
          image,
          description,
          quantities,
          categories
        );
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res
        .status(401)
        .json({ error: "Only admins can create products." });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, value, image, description, quantities, categories } =
      req.body;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      if (
        !name &&
        !value &&
        !image &&
        !description &&
        !quantities &&
        !categories
      ) {
        return res.status(400).json({
          error: {
            message: `Some field is required: name, value, image, quantities, categories`,
          },
        });
      }

      const service = new UpdateProductService();

      try {
        const result = await service.execute(
          Number(id),
          name,
          value,
          image,
          description,
          quantities,
          categories
        );
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res
        .status(401)
        .json({ error: "Only admins can update products." });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const service = new DeleteProductService();
      try {
        const result = await service.execute(Number(id));
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res
        .status(401)
        .json({ error: "Only admins can delete products." });
  }

  async vinculateProducts(req: Request, res: Response) {
    const { products, id } = req.body;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const service = new LinkProductToProduct();
      try {
        const result = await service.execute(products, id);
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res
        .status(401)
        .json({ error: "Only admins can vinculate products." });
  }

  async vinculateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const { categories } = req.body;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const service = new LinkProductToCategory();
      try {
        const result = await service.execute(Number(id), categories);
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res
        .status(401)
        .json({ error: "Only admins can vinculate products." });
  }

  async vinculatePromotion(req: Request, res: Response) {
    const { id } = req.params;
    const { promotion } = req.body;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const service = new LinkProductToPromotion();
      try {
        const result = await service.execute(Number(id), promotion);
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res
        .status(401)
        .json({ error: "Only admins can vinculate products." });
  }

  async vinculateSize(req: Request, res: Response) {
    const { id } = req.params;
    const { quantities } = req.body;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const service = new LinkProductToSize();
      try {
        const result = await service.execute(Number(id), quantities);
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res
        .status(401)
        .json({ error: "Only admins can vinculate products." });
  }

  async listAll(req: Request, res: Response) {
    const { is_admin: isAdmin } = req;
    const {
      size_id: sizeFilter,
      category_id: categoryFilter,
      max_value: maxValue,
    } = req.query;
    const service = new GetAllTransactionsServices();

    try {
      const result = await service.execute(
        Number(sizeFilter),
        categoryFilter,
        Number(maxValue),
        isAdmin
      );
      return res.json(result);
    } catch (err) {
      return res
        .status(err.code ?? 400)
        .json({ error: err.error ?? err.message });
    }
  }

  async find(req: Request, res: Response) {
    const { id: productId } = req.params;
    const service = new GetProductFromIdServices();

    try {
      const result = await service.execute(Number(productId));
      return res.json(result);
    } catch (err) {
      return res
        .status(err.code ?? 400)
        .json({ error: err.error ?? err.message });
    }
  }
}

export { ProductsController };
