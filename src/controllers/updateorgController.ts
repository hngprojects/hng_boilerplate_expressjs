import { Request, Response } from "express";
import { UpdateOrganizationDetails } from "../services/updateorg.service";

export const updateOrganization = async (req: Request, res: Response) => {
  const { organization_id } = req.params;
  const updateData = req.body;

  try {
    const organization = await UpdateOrganizationDetails(
      organization_id,
      updateData,
    );
    return res.status(200).json({
      message: "Organization details updated successfully",
      status_code: 200,
      data: organization,
    });
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({
        status: "unsuccessful",
        status_code: 404,
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        status_code: 500,
        message:
          "Failed to update organization details. Please try again later.",
      });
    }
  }
};
