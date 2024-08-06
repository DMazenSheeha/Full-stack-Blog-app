require("dotenv").config();
const port = process.env.PORT;
const dbUrl = process.env.MONGODB_URL;
const User = require("./models/userModel");
const cors = require("cors");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const cookieParser = require("cookie-parser");
const Post = require("./models/postModel");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
mongoose.connect(dbUrl).then(() => {
  console.log("Connected With Mongodb");
});

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/register", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const newUser = await User.create({
      userName,
      password: bcrypt.hashSync(password, 10),
    });
    const token = await JWT.sign({ userName }, JWT_SECRET_KEY);
    res.cookie("token", token).json("ok");
  } catch (err) {
    res.status(400).json(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json("User is not defiend");
    }
    const truePass = await bcrypt.compare(password, user.password);
    if (!truePass) {
      res.status(405).json("Wrong Password");
    } else {
      const token = await JWT.sign({ userName }, JWT_SECRET_KEY);
      res.cookie("token", token).json(user);
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    JWT.verify(token, JWT_SECRET_KEY, {}, (err, info) => {
      if (err) return res.json(null);
      return res.json(info);
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

app.post("/logout", (req, res) => {
  try {
    res.cookie("token", "").json("ok");
  } catch (err) {
    res.status(400).json(err.message);
  }
});

app.post("/post", upload.single("file"), async (req, res) => {
  try {
    const { token } = req.cookies;
    const { title, summary, content } = req.body;
    const parts = req.file.originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = req.file.path + "." + ext;
    fs.renameSync(req.file.path, newPath);
    JWT.verify(token, JWT_SECRET_KEY, {}, async (err, info) => {
      if (err) throw Error;
      await Post.create({
        title,
        summary,
        content,
        createdBy: info.userName,
        cover: newPath,
      });
      const post = await Post.findOne({ title }, { __v: false });
      res.json(post);
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch {
    res.status(400).json(err.message);
  }
});

app.get("/posts/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id.slice(1) }, { __v: false });
    res.json(post);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

app.put("/posts/:id", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.id;
    const { title, summary, content } = req.body;
    console.log(req.body);
    let newPath = false;
    if (req.file) {
      const parts = req.file.originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = req.file.path + "." + ext;
      fs.renameSync(req.file.path, newPath);
    }
    const post = await Post.findOne({ _id: id });
    const updated = await Post.findOneAndUpdate(
      { _id: id },
      {
        title,
        summary,
        content,
        createdBy: post.createdBy,
        cover: newPath ? newPath : post.cover,
      }
    );
    res.json("Ok");
  } catch (err) {
    res.status(400).json(err.message);
  }
});

app.all("*", (req, res) => {
  res.json("Page Is Not Defiend");
});

app.listen(port, () => {
  console.log(`Run On Port ${port}`);
});
