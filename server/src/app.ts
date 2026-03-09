import  Express  from "express";
import  morgan  from "morgan";
import  cors  from "cors";

const app = Express();

app.use(morgan("dev"));
app.use(cors());
app.use(Express.json());

export default app;