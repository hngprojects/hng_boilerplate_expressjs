import swaggerUi from 'swagger-ui-express';
import express from 'express';
import { apiDocumentation } from "./docs/apidocs";
// const YAML = require('yamljs');

const PORT = process.env.PORT || 4500;
// const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();

app.use("/documentation", swaggerUi.serve, swaggerUi.setup(apiDocumentation));
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
