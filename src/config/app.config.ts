import config from ".";

const APP_CONFIG = Object.freeze({
  USE_HTTPS: config.NODE_ENV !== "development" ? true : false,
});

export default APP_CONFIG;
