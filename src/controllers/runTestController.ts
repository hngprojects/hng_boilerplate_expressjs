import { exec } from "child_process";
import { Request, Response } from "express";

export const runTestController = async (req: Request, res: Response) => {
  exec(
    "python3 src/controllers/tests/tests/run_tests.py",
    (error, stdout, stderr) => {
      if (stderr) {
        res.status(500).json({
          status_code: 500,
          message: "Script error",
          error: stderr,
        });
      } else if (error) {
        res.status(500).json({
          status_code: 500,
          message: "Script error",
          error: error,
        });
      } else {
        const formattedOutput = stdout
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join("\n");

        res.status(200).json({
          status_code: 200,
          message: "Script executed successfully",
          data: formattedOutput,
        });
      }
    },
  );
};
