import { Request, Response } from "express";
import { GetAllCategoriesServices } from "../services/Products/Categories/GetAllCategoriesServices";
import { CreateCategoriesService } from "../services/Products/Categories/CreateCategoriesService";
import { DeleteCategoriesService } from "../services/Products/Categories/DeleteCategoriesService";

class CategoriesController {
  async create(req: Request, res: Response) {
    const { name } = req.body;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const errors: String[] = [];
      !name && errors.push("name");

      if (errors.length !== 0) {
        return res.status(400).json({
          error: `Field is required: ${errors[0]}`,
        });
      }

      const service = new CreateCategoriesService();

      try {
        const result = await service.execute(name);
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res
        .status(401)
        .json({ error: "Only admins can create categories." });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const service = new DeleteCategoriesService();
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
        .json({ error: "Only admins can delete categories." });
  }

  async listAll(req: Request, res: Response) {
    const service = new GetAllCategoriesServices();

    try {
      const result = await service.execute();
      return res.json(result);
    } catch (err) {
      return res
        .status(err.code ?? 400)
        .json({ error: err.error ?? err.message });
    }
  }
}

export { CategoriesController };
