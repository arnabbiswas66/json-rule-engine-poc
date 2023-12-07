'use strict';

const productData = {
  9781119778899: {
    id: 9781119778899,
    lifecycleStatus: 'DISCONTINUED',
    custom: false

  },
  9781119790976: {
    id: 9781119790976,
    lifecycleStatus: 'PREVIEW',
    custom: false,
    marketRestriction: ['US', 'GB']

  },
  9781119826552: {
    id: 9781119826552,
    lifecycleStatus: 'ACTIVE',
    custom: true
  },
  9781119503668: {
    id: 9781119503668,
    lifecycleStatus: 'ACTIVE',
    custom: false,
    marketRestriction: ['AF', 'IR']
  }

};

const localeData = {
  en_us: {
    language: 'en',
    country: 'US'
  },
  en_gb: {
    language: 'en',
    country: 'GB'
  }, 
  en_fr: {
    language: 'en',
    country: 'FR'
  }
}

/**
 * mock api client for retrieving product information
 */
export function getProductInformation(productId) {
    const message = 'loading product information for "' + productId + '"';
    console.log(message);
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            resolve(productData[productId]);
        });
    });
}

export function getLocaleInformation(locale) {
  const message = 'loading locale information for "' + locale + '"';
  console.log(message);
  return new Promise((resolve, reject) => {
    setImmediate(() => {
        resolve(localeData[locale]);
    });
});
}