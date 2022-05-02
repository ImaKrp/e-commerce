import { Router } from "express";

//? Controllers

import { UserController } from "./controllers/UserController";
import { ProductsController } from "./controllers/ProductsController";
import { SizesController } from "./controllers/SizesController";
import { CategoriesController } from "./controllers/CategoriesController";
import { OrderController } from "./controllers/OrderController";
import { CouponController } from "./controllers/CouponController";
import { PromotionController } from "./controllers/PromotionController";

//? MiddleWares

import { ensureAuthenticated } from "./middleWare/ensureAuthenticated";
import { getUserPermission } from "./middleWare/getUserPermission";

const router = Router();

//? User

router.post("/register", new UserController().create);

router.post("/authenticate", new UserController().authenticate);

router.put(
  "/user/update",
  ensureAuthenticated,
  getUserPermission,
  new UserController().update
);

router.get(
  "/users",
  ensureAuthenticated,
  getUserPermission,
  new UserController().listAll
);

//? Order

router.get(
  "/orders",
  ensureAuthenticated,
  getUserPermission,
  new OrderController().listAll
);

router.delete(
  "/orders/delete",
  ensureAuthenticated,
  new OrderController().getActive
);

router.get(
  "/orders/active",
  ensureAuthenticated,
  new OrderController().getActive
);

router.put(
  "/orders/active",
  ensureAuthenticated,
  getUserPermission,
  new OrderController().update
);

router.delete(
  "/orders/active",
  ensureAuthenticated,
  getUserPermission,
  new OrderController().delete
);

router.post(
  "/orders",
  ensureAuthenticated,
  getUserPermission,
  new OrderController().create
);

router.patch(
  "/orders/conclude",
  ensureAuthenticated,
  getUserPermission,
  new OrderController().conclude
);

//? Products

router.get("/products", getUserPermission, new ProductsController().listAll);

router.get("/products/:id", new ProductsController().find);

router.delete(
  "/products/:id",
  ensureAuthenticated,
  getUserPermission,
  new ProductsController().delete
);

router.post(
  "/products",
  ensureAuthenticated,
  getUserPermission,
  new ProductsController().create
);

router.put(
  "/products/:id",
  ensureAuthenticated,
  getUserPermission,
  new ProductsController().update
);

router.post(
  "/products/:id/categories",
  ensureAuthenticated,
  getUserPermission,
  new ProductsController().vinculateCategory
);

router.post(
  "/products/link",
  ensureAuthenticated,
  getUserPermission,
  new ProductsController().vinculateProducts
);

router.post(
  "/products/:id/sizes",
  ensureAuthenticated,
  getUserPermission,
  new ProductsController().vinculateSize
);

router.post(
  "/products/:id/promotions",
  ensureAuthenticated,
  getUserPermission,
  new ProductsController().vinculatePromotion
);

//? Sizes

router.get("/sizes", new SizesController().listAll);

router.delete(
  "/sizes/:id",
  ensureAuthenticated,
  getUserPermission,
  new SizesController().delete
);

router.post(
  "/sizes",
  ensureAuthenticated,
  getUserPermission,
  new SizesController().create
);

//? Categories

router.get("/categories/", new CategoriesController().listAll);

router.delete(
  "/categories/:id",
  ensureAuthenticated,
  getUserPermission,
  new CategoriesController().delete
);

router.post(
  "/categories",
  ensureAuthenticated,
  getUserPermission,
  new CategoriesController().create
);

//? Promotions

router.get(
  "/promotions/",
  ensureAuthenticated,
  getUserPermission,
  new PromotionController().listAll
);

router.delete(
  "/promotions/:id",
  ensureAuthenticated,
  getUserPermission,
  new PromotionController().delete
);

router.post(
  "/promotions",
  ensureAuthenticated,
  getUserPermission,
  new PromotionController().create
);
//? Coupon

router.get(
  "/coupons",
  ensureAuthenticated,
  getUserPermission,
  new CouponController().listAll
);

router.delete(
  "/coupons/:id",
  ensureAuthenticated,
  getUserPermission,
  new CouponController().delete
);

router.post(
  "/coupons",
  ensureAuthenticated,
  getUserPermission,
  new CouponController().create
);

router.post(
  "/coupons/apply",
  ensureAuthenticated,
  getUserPermission,
  new CouponController().applyCoupon
);

export { router };
