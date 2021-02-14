import express from 'express';
import Joi from 'joi';
import * as domainTools from '../lib/domainTools';
import swaggerUi from 'swagger-ui-express';
import * as swaggerSpec from '../swagger.json';
import dotenv from 'dotenv';
dotenv.config();

// SET UP APP
const app: express.Application = express();

// VALIDATION SCHEMA
const domainPostSchema = Joi.object({
  domain: Joi.alternatives().try(Joi.string().domain(), Joi.string().ip()).required(),
  services: Joi.array().items(Joi.string().valid('geolocation', 'rdap', 'reversedns', 'ping')).single().default('ping')
});

// TESTING ENDPOING
app.get('/', function (req, res) {
  res.send('hello world');
});

// DATA ENDPOINT
app.get('/domain', async function (req, res, next) {
  try {
    console.log(req.params);
    const validatedParams = await domainPostSchema.validateAsync(req.query);
    const serviceResponses = await domainTools.getServiceResponses(validatedParams);
    res.status(200).json(serviceResponses);
  } catch (err) {
    next(err);
  }
});

// SET UP DOCS
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// RETURN ERRORS
app.use(function (err, req, res, next) {
  const errResponse = {
    error: err.stack
  };
  console.error(err);
  res.status(500).json(errResponse);
});

// START LISTENING
app.listen(process.env.PORT, function () {
  console.log('Listening on port ' + process.env.PORT);
});
