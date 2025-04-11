import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateQuestion } from "../middlewares/validateQuestion.mjs";

const questionRouter = Router();

// //get all questions
// questionRouter.get("/", async (req, res) => {
//     try {
//         const result = await connectionPool.query("SELECT * FROM questions");

//         if (result.rowCount === 0) {
//             return res.status(404).json({ error: "No questions found" });
//         }

//         return res.status(200).json({
//             message: "Questions retrieved successfully",
//             data: result.rows, // 💡 use "data" instead of "question" for list
//         });
//     } catch (error) {
//         console.error("Error fetching questions:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// });

//get all question, able to query title and category
questionRouter.get("/", async (req, res) => {
  try {
    const title = req.query.title;
    const category = req.query.category;

    let query = `SELECT * FROM questions`;
    let values = [];

    if (title && category) {
      query += ` WHERE title ILIKE $1 AND category = $2`;
      values = [`%${title}%`, category];
    } else if (title) {
      query += ` WHERE title ILIKE $1`;
      values = [`%${title}%`];
    } else if (category) {
      query += ` WHERE category = $1`;
      values = [category];
    }

    console.log("Query: ", query);

    const result = await connectionPool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Question not found" });
    }
    return res.status(200).json({
      message: "Question retrieved successfully",
      data: result.rows,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//get question by id
questionRouter.get("/:id", async (req, res) => {
  const questionId = req.params.id;

  try {
    const result = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    return res.status(200).json({
      message: "Question retrieved successfully",
      data: result.rows[0],
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//create question
questionRouter.post("/", validateCreateQuestion, async (req, res) => {
  const newQuestion = req.body;

  try {
    const result = await connectionPool.query(
      `INSERT INTO questions (title, description, category) VALUES ($1, $2, $3) RETURNING *`,
      [newQuestion.title, newQuestion.description, newQuestion.category]
    );

    return res.status(201).json({
      message: "Question create successfully",
      data: result.rows[0],
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//dynamic patch update
questionRouter.patch("/:id", async (req, res) => {
  const questionId = req.params.id;
  const updatePatch = req.body;

  const fields = [];
  const values = [];
  let index = 1;

  for (const key in updatePatch) {
    if (updatePatch[key] !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(updatePatch[key]);
      index++;
    }
  }

  if (fields.length === 0) {
    return res
      .status(400)
      .json({ error: "No valid fields provided for update." });
  }

  values.push(questionId);

  try {
    const result = await connectionPool.query(
      `UPDATE questions
        SET ${fields.join(", ")}
        WHERE id = $${index}
        RETURNING *`,
      values
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    return res.status(200).json({
      message: "Patch updated successfully",
      data: result.rows[0],
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//delete question and cascade delete answers
questionRouter.delete("/:id", async (req, res) => {
  const questionId = req.params.id;

  try {
    const result = await connectionPool.query(
      `DELETE 
            FROM questions
            WHERE id = $1
            RETURNING *
            `,
      [questionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    return res.status(200).json({
      message: "Deleted question successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default questionRouter;
