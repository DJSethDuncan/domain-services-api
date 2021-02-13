import axios from 'axios';

interface ValidatedBody {
  domain: string;
  services: Array<string>;
}

export async function getServiceResponses(body: ValidatedBody): Promise<any> {
  try {
    let promises: any[] = [];
    let errs: any[] = [];
    let response = {
      domain: body.domain
    };
    body.services.map(service => {
      try {
        let getPromise: Promise<any> = testFunc(body.domain, service);
        promises.push(getPromise);
      } catch (mapErr) {
        errs.push(mapErr);
      }
    });
    if (errs.length > 0) {
      throw new Error('MAP ERR');
    }
    let promisesResponse = await Promise.all(promises);
    promisesResponse.forEach(promiseResponse => {
      let thisConfigData = JSON.parse(promiseResponse.config.data);
      response[thisConfigData.service] = promiseResponse.data;
    });
    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function testFunc(host: string, service: any) {
  try {
    let endpoint = '';

    switch (service) {
      case 'geolocation':
        endpoint = '/geolocation';
        break;
      case 'rdap':
        endpoint = '/rdap';
        break;
      case 'reversedns':
        endpoint = '/reversedns';
        break;
      case 'ping':
        endpoint = '/ping';
        break;
    }

    let serviceResponse = await axios({
      method: 'POST',
      url: process.env.SERVICES_API_URL + endpoint,
      data: {
        host: host,
        service: service // put this here so I can parse the promises back out later after I get the array of promise results
      }
    });
    return Promise.resolve(serviceResponse);
  } catch (err) {
    return Promise.reject(err);
  }
}
