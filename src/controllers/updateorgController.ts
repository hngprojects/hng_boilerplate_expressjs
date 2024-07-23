import { Request, Response } from "express";
import { UpdateOrganizationDetails } from "../services/updateorg.service";
import AppDataSource from "../data-source";

export const updateOrganization = async (req: Request, res: Response) => {
  const { organisation_id } = req.params;
  const updateData = req.body;

  try {
    const organisation = await UpdateOrganizationDetails(
      AppDataSource,
      organisation_id,
      updateData
    );
    res.status(200).json({
      message: "Organization details updated successfully",
      status_code: 200,
      data: organisation,
    });
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({
        status: "unsuccessful",
        status_code: 404,
        message: error.message,
      });
    }
  }
  return res.status(500).json({
    status: "failed",
    status_code: 500,
    message: "Failed to update organization details. Please try again later.",
  });
};
