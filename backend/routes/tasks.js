const express = require("express");
const router = express.Router();
const ts = require("../services/taskService");

const { TaskModel, validateTask } = require("../models/taskModel");

router.get("/", async (req, res) => {
  const data = await TaskModel.find({});
  res.json(data);
});

router.post("/", async (req, res) => {
  const validBody = validateTask(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const data = new TaskModel(req.body);
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: "did not work" });
  }
});

router.put("/:idEdit", async (req, res) => {
  const validBody = validateTask(req.body);
  if (validBody.error) {
    return res.status(401).json(validBody.error.details);
  }
  try {
    const data = await TaskModel.updateOne(
      { task_id: req.params.idEdit },
      req.body
    );
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.delete("/project/:id", async (req, res) => {
  const data = await ts.removeUserFromTasks(req.params.id, req.body.email);

  res.send(data);
});

router.get("/byProjectId/:id", async (req, res) => {
  const allTasks = await TaskModel.find({ project_id: req.params.id });
  res.json(allTasks);
});

router.get("/byEmail/:email", async (req, res) => {
  const allTasks = await TaskModel.find({ email: req.params.email });
  res.json(allTasks);
});

router.delete("/:idDel", async (req, res) => {
  const data = await TaskModel.deleteOne({ task_id: req.params.idDel });
  res.json(data);
});

module.exports = router;
