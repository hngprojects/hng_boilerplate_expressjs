/* eslint-disable @typescript-eslint/no-explicit-any */
import AppDataSource from "../data-source";
import { API_STATUS, ApiStatus } from "../models/api-model";
import { GroupedApi } from "../types";

const apiStatusRepository = AppDataSource.getRepository(ApiStatus);
const MAX_ALLOWED_RESPONSE_TIME = 2000;

const determineStatus = (
  statusCode: number,
  responseTime: number,
): API_STATUS => {
  if (statusCode >= 200 && statusCode < 300) {
    if (responseTime && responseTime > MAX_ALLOWED_RESPONSE_TIME) {
      return API_STATUS.DEGRADED;
    }
    return API_STATUS.OPERATIONAL;
  } else if (statusCode >= 500) {
    return API_STATUS.DOWN;
  }
  return API_STATUS.DEGRADED;
};

const parseJsonResponse = async (resultJson: any): Promise<void> => {
  const apiGroups = resultJson.collection.item;

  for (const apiGroup of apiGroups) {
    for (const api of apiGroup.item) {
      let status = API_STATUS.DEGRADED;
      let responseTime = null;

      if (api.response && api.response.length > 0) {
        const response = api.response[0];
        responseTime = response.responseTime || null;
        status = determineStatus(response.code, responseTime);
      }

      const apiStatus = apiStatusRepository.create({
        api_group: apiGroup.name,
        api_name: api.name,
        status,
        response_time: responseTime,
        details: responseTime ? `Response time: ${responseTime}ms` : null,
      });

      await apiStatusRepository.save(apiStatus);
    }
  }
};

const fetchApiStatusService = async () => {
  const api_status_response = await apiStatusRepository.find();

  const groupedAPIs = api_status_response.reduce((acc, current) => {
    const existingGroup = acc.find(
      (group) => group.api_group === current.api_group,
    );

    if (existingGroup) {
      existingGroup.collection.push({
        api_name: current.api_name,
        is_operational: current.status,
        details: current.details,
        last_checked: current.updated_at,
      });
    } else {
      acc.push({
        api_group: current.api_group,
        is_operational: API_STATUS.OPERATIONAL,
        collection: [
          {
            api_name: current.api_name,
            is_operational: current.status,
            details: current.details,
            last_checked: current.updated_at,
          },
        ],
      });
    }

    return acc;
  }, [] as GroupedApi[]);

  const response_dto = groupedAPIs.map((api) => {
    const hasDegraded = api.collection.some(
      (apiCollection) =>
        apiCollection.is_operational !== API_STATUS.OPERATIONAL,
    );

    if (hasDegraded) {
      api.is_operational = API_STATUS.DEGRADED;
    }

    return api;
  });

  return response_dto;
};

export { fetchApiStatusService, parseJsonResponse };
