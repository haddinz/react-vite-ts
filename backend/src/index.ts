import cors from "cors";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { productRoutes } from "./routes/productRoutes";
import { seedRouter } from "./routes/seed";
import { userRoutes } from "./routes/userRoutes";
import { orderRoutes } from "./routes/orderRoutes";
import { keyRoutes } from "./routes/keyRoutes";
import path from "path";

dotenv.config();
const mongoodb_uri = process.env.mongoodb_uri || "mongoodb://localhost/react-vite-ts";
mongoose.set("strictQuery", true);
mongoose
  .connect(mongoodb_uri)
  .then(() => {
    console.log("Connect To MongooDB");
  })
  .catch(() => {
    console.log("Cant Connect To MongooDB");
  });

const app = express();

app.use(
  //cors for handle error because network
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/seed", seedRouter);
app.use("/api/keys", keyRoutes);

app.use(express.static(path.join(__dirname, "../../frontend/.next")));
app.get("*", (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, "../../frontend/.next/server/page.js"))
);

// const PORT = 4000;
const PORT: number = parseInt((process.env.port || '4000') as string, 10)
app.listen(PORT, () => {
  console.log(`server running at localhost ${PORT}`);
});
