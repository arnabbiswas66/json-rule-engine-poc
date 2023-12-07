'use strict'

import { Engine } from 'json-rules-engine';

// example client for making asynchronous requests to an api, database, etc
import { getProductInformation, getLocaleInformation } from './support/product-api-client.js';

async function handle(productInfo, localeInfo) {
  //Setup a new engine
  const engine = new Engine();

  const productVisibilityRule = {
    conditions: {
      any: [{
        fact: 'product-information',
        operator: 'equal',
        value: 'DISCONTINUED',
        path: '$.lifecycleStatus' // access locale-resolved 'lifecycleStatus' property of "product-information"
      }, {
        fact: 'product-information',
        operator: 'equal',
        value: true,
        path: '$.custom' // access the 'custom' property of "product-information"
      }, {
        fact: 'product-information',
        operator: 'contains',
        path: '$.marketRestriction', // access the 'marketRestriction' property of "product-information"
        value: {
          fact: 'locale',
          path: '$.country',
        }
      }]
    },
    event: {
      type: 'product-restricted',
      params: {
        message: 'product that should not be made visible'
      }
    }
  };
  engine.addRule(productVisibilityRule);

  engine.addFact('product-information', async (params, almanac) => {
    return productInfo;
  });

  engine.addFact('locale', async (param, almanac) => {
    return localeInfo;
  });

  // define fact(s) known at runtime

  const { events } = await engine.run();
  events?.length ? console.log(productInfo.id + ' is a ' + events.map(event => event.params.message))
    : console.log(productInfo.id + ' is a product that can be made visible');
}

const productId = 9781119503668;
const localeId = 'en_fr';
const productInfo = await getProductInformation(productId);
const localeInfo = await getLocaleInformation(localeId);

handle(productInfo, localeInfo);