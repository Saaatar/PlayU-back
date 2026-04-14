import "dotenv/config";
import express from "express";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const main = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`API is runing in the port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Start API error: ${error}`);
  }
};

main();
