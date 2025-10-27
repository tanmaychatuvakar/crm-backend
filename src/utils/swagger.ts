import { Application } from 'express';
import { BASE_URI } from '@config';
import { logger } from './logger';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';

const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

function swaggerDocs(app: Application) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  logger.info(`Docs available on ${BASE_URI}/api-docs 📃`);
}

export default swaggerDocs;
