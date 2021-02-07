import express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
const cluster = require('cluster');

if (cluster.isMaster) {
    masterProcess();
} else {
    workerProcess();
}

function masterProcess () {

    let workerCount = require('os').cpus().length;
    let workers = [];

    // START WORKERS
    for (let i = 0; i < workerCount; i++) {
       const thisWorker = cluster.fork();
       workers.push(thisWorker)
       thisWorker.on('message', function(message) {
           console.log('Master has received a message from worker: ' + message.msg)
       })
    }

    // HANDLE WORKER SHUTDOWN
    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });

}

function workerProcess() {

    // SET UP API
    const app: express.Application = express();
    app.use(bodyParser.urlencoded({ extended: true }));

    // ENDPOINTS
    app.get('/', function (req, res) {
        console.log('get: /');
        res.send('Hello Worldz!');
    });

    const domainPostSchema = Joi.object({
        domain: Joi.alternatives().try(Joi.string().domain(), Joi.string().ip()),
        services: Joi.alternatives().try(
            Joi.string().valid('geoip', 'rdap', 'reversedns', 'ping'),
            Joi.array().items(Joi.string().valid('geoip', 'rdap', 'reversedns', 'ping'))
        )
    })

    app.post('/domain', async function (req, res) {
        try {
            console.log('post: /domain')
            
            // do post validation
            const value = await domainPostSchema.validateAsync(req.body)

            let response = {
                'response': 'ok',
                'domain': req.body.domain
            };

            console.log('typeof: ', typeof req.body.services)
            if (typeof req.body.services == 'string') {
                // run given service
                // push service-response to response object
                response[req.body.services] = 'stuff'
            } else if (typeof req.body.services == 'object') { // typeof returns 'object' for array
                req.body.services.forEach((thisService) => {
                    // run given service
                    // promise-all
                    // push service-response to response object
                    response[thisService] = 'stuff'
                })
            }

            res.status(200).json(response)
        } catch (err) {
            const errorResponse = {
                "errors": err.details.map(errorDetails => errorDetails.message)
            };
            res.status(500).json(errorResponse)
        }
    })

    // START LISTENING
    app.listen(3000, function () {
        // console.log('Example app listening on port 3000!');
    });

}