import  Express  from "express";
import  morgan  from "morgan";
import  cors  from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import expeseRouter from "./routes/expense.routes.js";
import categoryRouter from "./routes/category.routes.js";
import incomeRouter from "./routes/income.routes.js";

const app = Express();

app.use(morgan("dev"));
app.use(cors());
app.use(Express.json());
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/expenses', expeseRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/incomes', incomeRouter);

export default app;