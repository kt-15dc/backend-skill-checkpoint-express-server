import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const voteRouter = Router();

// Vote on a question
voteRouter.post("/questions/:id/votes", async (req, res) => {
    const questionId = req.params.id;
    const { vote } = req.body; // expect vote = 1 or -1

    if (vote !== 1 && vote !== -1) {
        return res.status(400).json({ error: "Vote must be either 1 (upvote) or -1 (downvote)." });
    }

    try {
        // Check if the question exists
        const checkQuestion = await connectionPool.query(
            `SELECT id FROM questions WHERE id = $1`,
            [questionId]
        );

        if (checkQuestion.rowCount === 0) {
            return res.status(404).json({ error: "Question not found." });
        }

        // Insert the vote
        const result = await connectionPool.query(
            `INSERT INTO question_votes (question_id, vote) VALUES ($1, $2) RETURNING *`,
            [questionId, vote]
        );

        return res.status(201).json({
            message: "Vote recorded successfully for question.",
            data: result.rows[0],
        });

    } catch (error) {
        console.error("Error voting on question:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

// Vote on an answer
voteRouter.post("/answers/:id/votes", async (req, res) => {
    const answerId = req.params.id;
    const { vote } = req.body; // expect vote = 1 or -1

    if (vote !== 1 && vote !== -1) {
        return res.status(400).json({ error: "Vote must be either 1 (upvote) or -1 (downvote)." });
    }

    try {
        // Check if the answer exists
        const checkAnswer = await connectionPool.query(
            `SELECT id FROM answers WHERE id = $1`,
            [answerId]
        );

        if (checkAnswer.rowCount === 0) {
            return res.status(404).json({ error: "Answer not found." });
        }

        // Insert the vote
        const result = await connectionPool.query(
            `INSERT INTO answer_votes (answer_id, vote) VALUES ($1, $2) RETURNING *`,
            [answerId, vote]
        );

        return res.status(201).json({
            message: "Vote recorded successfully for answer.",
            data: result.rows[0],
        });

    } catch (error) {
        console.error("Error voting on answer:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

export default voteRouter;
