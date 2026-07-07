import express from "express";
const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    architecture: "Express REST Router",
  });
});

router.get("/users", (req, res) => {
  res.status(200).json({
    message: "GET request successful for /users",
  });
});

router.post("/", (req, res) => {
  req.log.info("System health status requested");
  const { username, email } = req.body;

  if (!username || !email) {
    req.log.warn(
      { body: req.body },
      "User creation rejected due to missing parameters",
    );
    return res
      .status(400)
      .json({ error: "Missing username or email parameters." });
  }
  req.log.info({ username, email }, "Registering new user account metadata");
  const newUser = { id: Math.floor(Math.random() * 1000), username, email };

  res.status(201).json({ success: true, user: newUser });
});

export default router;
