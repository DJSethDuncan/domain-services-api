import { expect } from 'chai';
import * as domainTools from '../lib/domainTools';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

interface TestQuery {
  domain: string;
  services: Array<string>;
}

const testIP = '127.0.0.1';
const testDomain = 'www.google.com';
const domainTestQuery: TestQuery = {
  domain: testDomain,
  services: ['geolocation', 'rdap', 'ping', 'reversedns']
};
const ipTestQuery: TestQuery = {
  domain: testIP,
  services: ['geolocation', 'rdap', 'ping', 'reversedns']
};
const testQuerySingleService: TestQuery = {
  domain: testDomain,
  services: ['ping']
};

describe('.env', function () {
  it('PORT exists', function () {
    expect(process.env.PORT).to.not.be.empty;
  });
  it('SERVICES_API_URL exists', function () {
    expect(process.env.SERVICES_API_URL).to.not.be.empty;
  });
});

describe('getServiceResponses', function () {
  it('Returns a promise', function () {
    // no need to await here since we are just making sure it's a promise
    const promiseResponse = domainTools.getServiceResponses(domainTestQuery);
    expect(promiseResponse).to.be.a('promise');
  });
  it('Returns a JSON payload', async function () {
    const serviceResponses = await domainTools.getServiceResponses(domainTestQuery);
    console.log('-------------------------------------------');
    console.error(serviceResponses);
    expect(serviceResponses).to.be.an('object');
  });
  it('Works with an IP', async function () {
    const serviceResponses = await domainTools.getServiceResponses(ipTestQuery);
    expect(serviceResponses).to.be.an('object');
  });
  it('Works with a domain', async function () {
    const serviceResponses = await domainTools.getServiceResponses(domainTestQuery);
    expect(serviceResponses).to.be.an('object');
  });
  it('Works with only one service', async function () {
    const serviceResponses = await domainTools.getServiceResponses(testQuerySingleService);
    expect(serviceResponses).to.be.an('object');
  });
});

describe('serviceRequest', function () {
  it('Returns a promise', function () {
    // no need to await here since we are just making sure it's a promise
    const promiseResponse = domainTools.serviceRequest(testDomain, 'reversedns');
    expect(promiseResponse).to.be.a('promise');
  });
  it('Returns geolocation by ip', async function () {
    const serviceResponses = await domainTools.serviceRequest(testIP, 'geolocation');
    expect(serviceResponses).to.be.an('object');
  });
  it('Returns geolocation by domain', async function () {
    const serviceResponses = await domainTools.serviceRequest(testDomain, 'geolocation');
    expect(serviceResponses).to.be.an('object');
  });
  it('Returns rdap by ip', async function () {
    const serviceResponses = await domainTools.serviceRequest(testIP, 'rdap');
    expect(serviceResponses).to.be.an('object');
  });
  it('Returns rdap by domain', async function () {
    const serviceResponses = await domainTools.serviceRequest(testDomain, 'rdap');
    expect(serviceResponses).to.be.an('object');
  });
  it('Returns reversedns by ip', async function () {
    const serviceResponses = await domainTools.serviceRequest(testIP, 'reversedns');
    expect(serviceResponses).to.be.an('object');
  });
  it('Returns reversedns by domain', async function () {
    const serviceResponses = await domainTools.serviceRequest(testDomain, 'reversedns');
    expect(serviceResponses).to.be.an('object');
  });
  it('Returns ping by ip', async function () {
    const serviceResponses = await domainTools.serviceRequest(testIP, 'ping');
    expect(serviceResponses).to.be.an('object');
  });
  it('Returns ping by domain', async function () {
    const serviceResponses = await domainTools.serviceRequest(testDomain, 'ping');
    expect(serviceResponses).to.be.an('object');
  });
});
