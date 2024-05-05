import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import OpenAI from "openai";
// import cors from 'cors';


import serverless from "serverless-http";
const router = express.Router();


const app = express();
// app.use(cors());
// this part may raise error is executed in different environment
const __filename = fileURLToPath(import.meta.url);
const __dirname1 = dirname(__filename);
const port = 3000;

dotenv.config();
const messages = [];
const anyscale = new OpenAI({
  baseURL: "https://api.endpoints.anyscale.com/v1",
  apiKey: 'esecret_i2gu4jzabcetf6513cp23xrdcv',
});

async function main(input) {
  messages.push({ role: "user", content: input });
  const completion = await anyscale.chat.completions.create({
    model: "mistralai/Mistral-7B-Instruct-v0.1",
    messages: messages,
    temperature: 0.1,
    max_tokens: 200,
  });
  console.log("dummy message");
  return completion.choices[0]?.message?.content;
}

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname1, "index.html"));
});

router.post("/api", async function (req, res, next) {
  console.log(req.body);
  const mes = await main(req.body.input);
  res.json({ success: true, message: mes });
});


app.use("/.netlify/functions/app", router);
export default serverless(app);

app.listen(port, () => {
    console.log("Running...");
  });
  
// "test": "echo \"Error: no test specified\" && exit 1"