'use strict'

import { Engine } from 'json-rules-engine';

// example client for making asynchronous requests to an api, database, etc
import { getProductInformation, getLocaleInformation } from './support/product-api-client.js';

async function start() {
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
    const productId = await almanac.factValue('productId');
    return getProductInformation(productId);
  });

  engine.addFact('locale', async (param, almanac) => {
    const localeId = await almanac.factValue('localeId');
    return getLocaleInformation(localeId);
  });

  // define fact(s) known at runtime

  const productFact = { productId: 9781119790976 };
  const localeFact = { localeId: 'en_fr' };

  const facts = Object.assign({}, productFact, localeFact);
  const { events } = await engine.run(facts);
  events?.length ? console.log(facts.productId + ' is a ' + events.map(event => event.params.message))
    : console.log(facts.productId + ' is a product that can be made visible');
}
start();