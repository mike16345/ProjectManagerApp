import express from "express";
import dotenv from "dotenv";
import taskRouter from "./routes/tasks";
import userRouter from "./routes/users";
import projectRouter from "./routes/projects";
import googleUserRouter from "./routes/googleUser";
import path from "path";
import http from "http";
import cors from "cors";
import "./db/mongoConnect";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use("/tasks", taskRouter);
app.use("/users", userRouter);
app.use("/projects", projectRouter);
app.use("/googleUsers", googleUserRouter);

const server = http.createServer(app);

const port = "3002";

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
