import { Request, Response } from "express";
import { exec } from "child_process";

export const runTestController = async (req: Request, res: Response) => {
  exec("python3 ./tests/run_test.py", (error, stdout, stderr) => {
    if (stderr) {
      console.error(`stderr: ${stderr}`);
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
      console.log(`stdout: ${stdout}`);
      res.status(200).json({
        status_code: 200,
        message: "Script executed successfully",
        data: stdout,
      });
    }
  });
};
