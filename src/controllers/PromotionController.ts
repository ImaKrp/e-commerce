import { Request, Response } from "express";
import { GetAllPromotionServices } from "../services/Products/Promotion/GetAllPromotionServices";
import { DeletePromotionService } from "../services/Products/Promotion/DeletePromotionService";
import { CreatePromotionService } from "../services/Products/Promotion/CreatePromotionService";

class PromotionController {
  async create(req: Request, res: Response) {
    const { value } = req.body;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const errors: String[] = [];
      !value && errors.push("value");

      if (errors.length !== 0) {
        return res.status(400).json({
          error: `Field is required: ${errors[0]}`,
        });
      }

      const service = new CreatePromotionService();

      try {
        const result = await service.execute(value);
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res
        .status(401)
        .json({ error: "Only admins can create promotions." });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const service = new DeletePromotionService();
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
        .json({ error: "Only admins can delete promotions." });
  }

  async listAll(req: Request, res: Response) {
    const service = new GetAllPromotionServices();
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      try {
        const result = await service.execute();
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res
        .status(401)
        .json({ error: "Only admins can list promotions." });
  }
}

export { PromotionController };
