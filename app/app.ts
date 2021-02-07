import express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');

// Create a new express application instance
const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send('Hello Worldz!');
});

const domainPostSchema = Joi.object({
    domain: Joi.alternatives().try(Joi.string().domain(), Joi.string().ip())
})

app.post('/domain', async function (req, res) {
    try {
        
        const value = await domainPostSchema.validateAsync(req.body)
        console.log(value)
        let response = {
            'response':'ok'
        };
        res.status(200).json(response)
    } catch (err) {
        const errorResponse = {
            "errors": err.details.map(errorDetails => errorDetails.message)
        };
        res.status(500).json(errorResponse)
    }
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});