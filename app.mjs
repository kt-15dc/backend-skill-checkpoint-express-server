import express from "express";
import questionRouter from "./routes/questions.mjs";
import answerRouter from "./routes/answers.mjs";
import voteRouter from "./routes/vote.mjs";

const app = express();
const port = 4009;

app.use(express.json());
app.use('/questions', questionRouter);
app.use('/questions', answerRouter)
app.use("/", voteRouter)

//to test if the server is running
app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});




app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
