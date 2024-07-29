import { Request, Response } from "express";
import { swaggerSpecsContent } from "../swaggerConfig";

class DocsController {
  async downloadApiDocs(req: Request, res: Response) {
    console.log("**** the code is here to download ****");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=swagger-specs.json",
    );
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpecsContent);
  }
}

export default DocsController;
