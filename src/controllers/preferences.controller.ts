import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { Preference } from "../models/Preference.model";
import { Organization } from "../models/Organization.model";
import Logger from "../utils/logger";
import { validate as isUUID } from "uuid";

const preferenceRepository = AppDataSource.getRepository(Preference);
const organizationRepository = AppDataSource.getRepository(Organization);

export class PreferenceController {
  static async createPreference(req: Request, res: Response) {
    const { name, value } = req.body;
    const organizationId = req.params.organizationId;

    if (!isUUID(organizationId)) {
      return res.status(400).json({ error: "Invalid organization ID." });
    }

    try {
      const organization = await organizationRepository.findOne({
        where: { id: organizationId },
      });
      if (!organization) {
        return res.status(404).json({ error: "Organization not found." });
      }

      const existingPreference = await preferenceRepository.findOne({
        where: { name, organization: { id: organizationId } },
      });
      if (existingPreference) {
        return res
          .status(409)
          .json({ error: "Preference with the same name already exists." });
      }

      const preference = preferenceRepository.create({
        name,
        value,
        organization,
      });
      await preferenceRepository.save(preference);

      Logger.info(`Preference created for organization ${organizationId}`);
      return res.status(201).json({
        id: preference.id,
        name: preference.name,
        value: preference.value,
        message: "Preference created successfully.",
      });
    } catch (error) {
      Logger.error("Error creating preference:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  static async updatePreference(req: Request, res: Response) {
    const { name, value } = req.body;
    const { preference_id } = req.params;

    if (!isUUID(preference_id)) {
      return res.status(400).json({ error: "Invalid preference ID." });
    }

    try {
      const preference = await preferenceRepository.findOne({
        where: { id: preference_id },
      });
      if (!preference) {
        return res.status(404).json({ error: "Preference not found." });
      }

      preference.name = name;
      preference.value = value;

      await preferenceRepository.save(preference);

      Logger.info(`Preference ${preference_id} updated`);
      return res.status(200).json({
        id: preference.id,
        name: preference.name,
        value: preference.value,
        message: "Preference updated successfully.",
      });
    } catch (error) {
      Logger.error("Error updating preference:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  static async retrievePreferences(req: Request, res: Response) {
    const organizationId = req.params.organizationId;

    if (!isUUID(organizationId)) {
      return res.status(400).json({ error: "Invalid organization ID." });
    }

    try {
      const organization = await organizationRepository.findOne({
        where: { id: organizationId },
        relations: ["preferences"],
      });
      if (!organization) {
        return res.status(404).json({ error: "Organization not found." });
      }

      const preferences = organization.preferences;

      Logger.info(`Preferences retrieved for organization ${organizationId}`);
      return res.status(200).json({
        preferences: preferences.map((p) => ({
          id: p.id,
          name: p.name,
          value: p.value,
        })),
      });
    } catch (error) {
      Logger.error("Error retrieving preferences:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  static async deletePreference(req: Request, res: Response) {
    const { preference_id } = req.params;

    if (!isUUID(preference_id)) {
      return res.status(400).json({ error: "Invalid preference ID." });
    }

    try {
      const preference = await preferenceRepository.findOne({
        where: { id: preference_id },
      });
      if (!preference) {
        return res.status(404).json({ error: "Preference not found." });
      }

      await preferenceRepository.remove(preference);

      Logger.info(`Preference ${preference_id} deleted`);
      return res
        .status(200)
        .json({ message: "Preference deleted successfully." });
    } catch (error) {
      Logger.error("Error deleting preference:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}
