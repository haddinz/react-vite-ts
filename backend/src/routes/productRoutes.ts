import express from "express";
import asyncHandler from "express-async-handler";
import { ProductModel } from "../model/prodcutModel";

export const productRoutes = express.Router();

productRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await ProductModel.find();
    if (products) {
      res.json(products);
    } else {
      res.status(401).json({ message: "Can't Connect To Internet" });
    }
  })
);

productRoutes.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const productSlug = await ProductModel.findOne({ slug: req.params.slug});
    if (productSlug) {
      res.json(productSlug);
    } else {
      res.status(401).json({ message: "Product Not Found" });
    }
  })
);


// Here  syntax for fetching data from express local database Product
// ******************************************************************
// app.get("/api/product", (req: Request, res: Response) => {
//   res.json(Product);
// });

// //For request api with slug
// app.get("/api/product/:slug", (req: Request, res: Response) => {
//   // res.json(Product.find((x) => x.slug === req.params.slug))
//   const slugProdcut = Product.find((x) => x.slug === req.params.slug);
//   if (slugProdcut) {
//     res.json(slugProdcut);
//   } else {
//     res.status(401).json({ message: "Product Not Found Brouu" });
//   }
// });