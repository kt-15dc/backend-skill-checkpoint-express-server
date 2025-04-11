import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateAnswer } from "../middlewares/validateAnswer.mjs";

const answerRouter = Router();

//create answer
answerRouter.post("/:id/answers", validateCreateAnswer, async (req, res) => {
  const newAnswer = req.body;
  const question_id = req.params.id;

  try {
    // First check if question exists
    const checkQuestion = await connectionPool.query(
      `SELECT id 
            FROM questions 
            WHERE id = $1`,
      [question_id]
    );

    if (checkQuestion.rowCount === 0) {
      return res.status(404).json({ error: "Question not found." });
    }

    const result = await connectionPool.query(
      `INSERT INTO answers (question_id, content) VALUES ($1, $2) RETURNING *`,
      [question_id, newAnswer.content]
    );

    return res.status(201).json({
      message: "Answer created successfully",
      data: result.rows[0],
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "Internal Server Error or Question not found" });
  }
});

//get answer by QID
answerRouter.get("/:id/answers", async (req, res) => {
  const question_id = req.params.id;

  try {
    const result = await connectionPool.query(
      `SELECT *
            FROM answers
            WHERE question_id = $1`,
      [question_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Answers not found for this question." });
    }

    return res.status(200).json({
      message: "Answers retrieved successfully.",
      data: result.rows,
    });
  } catch (e) {
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default answerRouter;
