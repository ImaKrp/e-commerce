import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/User/AuthenticateUserService";
import { CreateUserService } from "../services/User/CreateUserService";
import { UpdateUserService } from "../services/User/UpdateUserService";
import { GetAllUsersService } from "../services/User/GetAllUsersService";

class UserController {
  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    const errors: String[] = [];
    !email && errors.push("email");
    !password && errors.push("password");

    if (errors.length !== 0) {
      return res.status(400).json({
        error: {
          message:
            errors.length === 1
              ? `Field is required: ${errors[0]}`
              : `Fields are required: ${errors.join(", ")}`,
        },
      });
    }

    const service = new AuthenticateUserService();
    try {
      const result = await service.execute(email, password);
      return res.json(result);
    } catch (err) {
      return res
        .status(err.code ?? 400)
        .json({ error: err.error ?? err.message });
    }
  }
  async create(req: Request, res: Response) {
    const { email, password, name, adress, phone, last_name } = req.body;

    const errors: String[] = [];
    !email && errors.push("email");
    !password && errors.push("password");
    !name && errors.push("name");
    !adress && errors.push("adress");
    !phone && errors.push("phone");

    if (errors.length !== 0) {
      return res.status(400).json({
        error: {
          message:
            errors.length === 1
              ? `Field is required: ${errors[0]}`
              : `Fields are required: ${errors.join(", ")}`,
        },
      });
    }

    const service = new CreateUserService();

    try {
      const result = await service.execute(
        email,
        password,
        name,
        adress,
        phone,
        last_name
      );
      return res.json(result);
    } catch (err) {
      return res
        .status(err.code ?? 400)
        .json({ error: err.error ?? err.message });
    }
  }
  async update(req: Request, res: Response) {
    const { user_id } = req;
    const { email, password, name, adress, phone, last_name } = req.body;

    if (!email && !password && !name && !last_name && !adress && !phone) {
      return res.status(400).json({
        error: {
          message: `Some field is required: email, password, name, adress, phone, last_name`,
        },
      });
    }

    const service = new UpdateUserService();
    try {
      const result = await service.execute(
        user_id,
        email,
        password,
        name,
        adress,
        phone,
        last_name
      );
      return res.json(result);
    } catch (err) {
      return res
        .status(err.code ?? 400)
        .json({ error: err.error ?? err.message });
    }
  }
  async listAll(req: Request, res: Response) {
    const { is_admin: isAdmin } = req;
    const service = new GetAllUsersService();

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
      return res.status(401).json({ error: "Only admins can create sizes." });
  }
}

export { UserController };
