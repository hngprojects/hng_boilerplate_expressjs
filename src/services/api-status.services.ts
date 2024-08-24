/* eslint-disable @typescript-eslint/no-explicit-any */
import AppDataSource from "../data-source";
import { API_STATUS, ApiStatus } from "../models/api-model";

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

export { parseJsonResponse };
