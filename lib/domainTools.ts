import axios from 'axios';

interface ValidatedQuery {
  domain: string;
  services: Array<string>;
}

export async function getServiceResponses(query: ValidatedQuery): Promise<any> {
  try {
    let promises: any[] = [];
    // let response = {
    //   domain: query.domain
    // };
    let response: any = {};
    query.services.map(service => {
      let getPromise: Promise<any> = serviceRequest(query.domain, service);
      promises.push(getPromise);
    });
    let promisesResponse = await Promise.all(promises);
    promisesResponse.forEach(promiseResponse => {
      response[promiseResponse.config.params.service] = promiseResponse.data;
    });
    console.log('response', response);
    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function serviceRequest(host: string, service: any) {
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
      method: 'GET',
      url: process.env.SERVICES_API_URL + endpoint,
      params: {
        host: host,
        service: service
      }
    });
    return Promise.resolve(serviceResponse);
  } catch (err) {
    return Promise.reject(err);
  }
}
