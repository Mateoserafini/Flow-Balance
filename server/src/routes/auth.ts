import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  // Handle login logic here
  res.send("Login endpoint");
});

router.post("/register", (req, res) => {
    // Handle registration logic here       
    res.send("Register endpoint");
});

export default router;