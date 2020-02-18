import bodyParser from "body-parser";
import { createReadStream } from "fs";

import express, { Request, Response } from "express";
import { deleteLocalFiles, filterImageFromURL } from "./util/util";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url } = req.query;
    if (!image_url) {
      return res.status(422).send({ message: "Please Provide an image url" });
    }
    try {
      const filteredImagePath = await filterImageFromURL(image_url);
      createReadStream(filteredImagePath).pipe(res);
      await deleteLocalFiles([filteredImagePath]);
    } catch (error) {
      res.status(500).send({ message: "An error occured while processing your image" });
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
