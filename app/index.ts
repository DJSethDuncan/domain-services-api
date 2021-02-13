import express from 'express';
import bodyParser from 'body-parser';
import Joi from 'joi';
import * as domainTools from '../lib/domainTools';
import dotenv from 'dotenv';
dotenv.config();

// SET UP API
const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: true }));

const domainPostSchema = Joi.object({
  domain: Joi.alternatives().try(Joi.string().domain(), Joi.string().ip()),
  services: Joi.alternatives().try(
    Joi.string().valid('geolocation', 'rdap', 'reversedns', 'ping'),
    Joi.array().items(Joi.string().valid('geolocation', 'rdap', 'reversedns', 'ping'))
  )
});

app.get('/', function (req, res, next) {
  res.send('hello world')
});

app.post('/domain', async function (req, res, next) {
  try {
    const validatedBody = await domainPostSchema.validateAsync(req.body);
    const serviceResponses = await domainTools.getServiceResponses(validatedBody);
    res.status(200).json(serviceResponses);
  } catch (err) {
    next(err);
  }
});

// return errors
app.use(function (err, req, res, next) {
  const errResponse = {
    error: err.stack
  };
  console.error(err);
  res.status(500).json(errResponse);
});

// START LISTENING
app.listen(process.env.PORT, function () {
  // debugging
  // console.log('Example app listening on port 3000!');
});
