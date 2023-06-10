import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { isAuth } from "../utils/generateToken";
import { OrderModel } from "../model/orderModels";
import { Product } from "../model/prodcutModel";

export const orderRoutes = express.Router();

orderRoutes.get(
  "/history",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({ user: req.user._id });
    if (orders) {
      res.json(orders);
    } else {
      res.status(401).json({ message: "You Not Order Yet" });
    }
  })
);

orderRoutes.post(
  "/",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).json({ message: "Cart Items Empty" });
    } else {
      const createOrder = await OrderModel.create({
        orderItems: req.body.orderItems.map((x: Product) => ({
          ...x,
          product: x._id,
        })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemPrice: req.body.itemPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
      res.status(201).json({ message: "Order Created", order: createOrder });
    }
  })
);

orderRoutes.get(
  "/:id",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const idOrder = await OrderModel.findById(req.params.id);
    if (idOrder) {
      res.json(idOrder);
    } else {
      res.status(401).json({ message: "Order Not Found " });
    }
  })
);

orderRoutes.put(
  "/:id/pay",
  isAuth,
  asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      (order.isPaid = true), (order.paidAt = new Date(Date.now()));
      order.paymentResult = {
        paymentId: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updateOrder = await order.save();
      res.send({ order: updateOrder, message: "Order Pay Successfully" });
    } else {
      res.status(404).json({ message: "Order ID Not Found" });
    }
  })
);
