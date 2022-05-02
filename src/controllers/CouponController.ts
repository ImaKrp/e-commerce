import { Request, Response } from "express";
import { ApplyCouponToActiveOrder } from "../services/Discount/ApplyCouponToActiveOrder";
import { CreateCouponService } from "../services/Discount/CreateCouponService";
import { DeleteCouponService } from "../services/Discount/DeleteCouponService";
import { GetAllCouponServices } from "../services/Discount/GetAllCouponServices";
import { GetActiveOrdersService } from "../services/Order/GetActiveOrdersService";

class CouponController {
  async applyCoupon(req: Request, res: Response) {
    const { is_admin: isAdmin, user_id: userId } = req;
    const { coupon } = req.body;

    if (!isAdmin) {
      const errors: String[] = [];
      !coupon && errors.push("coupon");

      if (errors.length !== 0) {
        return res.status(400).json({
          error: `Field is required: ${errors[0]}`,
        });
      }
      const service = new ApplyCouponToActiveOrder();

      try {
        const result = await service.execute(Number(userId), coupon);
        if (result) {
          try {
            const service = new GetActiveOrdersService();
            const result = await service.execute(Number(userId));
            return res.json(result);
          } catch (e) {
            return res.json(result);
          }
        }
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res.status(401).json({ error: "Admins can't update orders." });
  }

  async create(req: Request, res: Response) {
    const { name, value } = req.body;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const errors: String[] = [];
      !name && errors.push("name");
      !value && errors.push("value");

      if (errors.length !== 0) {
        return res.status(400).json({
          error: `Field is required: ${errors[0]}`,
        });
      }

      const service = new CreateCouponService();

      try {
        const result = await service.execute(name, value);
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res.status(401).json({ error: "Only admins can create coupons." });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const service = new DeleteCouponService();
      try {
        const result = await service.execute(Number(id));
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res.status(401).json({ error: "Only admins can delete coupons." });
  }

  async listAll(req: Request, res: Response) {
    const { is_admin: isAdmin } = req;

    if (isAdmin) {
      const service = new GetAllCouponServices();

      try {
        const result = await service.execute();
        return res.json(result);
      } catch (err) {
        return res
          .status(err.code ?? 400)
          .json({ error: err.error ?? err.message });
      }
    } else
      return res.status(401).json({ error: "Only admins can list coupons." });
  }
}

export { CouponController };
