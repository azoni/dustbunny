/**
 * Shared functionality file. This file will temporarily exist as an in-between step while refactoring the code.
 */

const values = require('./values.js');

/**
 * For buildseaport
 */
const opensea = require('opensea-js')
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;


/**
 * 
 * @returns The infura key that should be used at this specific hour. Doing time math to select the correct infura key.
 */
function getTimeBasedInfuraKey() {
  let currentHour = new Date().getHours();
  let keys = values.default.INFURA_KEY;
  let keyLen = keys.length;
  let INFURA_KEY = keys[Math.floor(currentHour/3)]

  if (keyLen === 6) {
    INFURA_KEY = keys[Math.floor(currentHour/4)]
  } else if(keyLen === 4) {
    INFURA_KEY = keys[Math.floor(currentHour/6)]
  } else if(keyLen === 5) {
    INFURA_KEY = keys[Math.floor(currentHour/5)]
  }
  return INFURA_KEY;
}

function buildSeaport(providerEngine) {
  let seaport = new OpenSeaPort(
    providerEngine,
    {
    networkName: Network.Main,
      apiKey: values.default.API_KEY
    },
    (arg) => console.log(arg)
  );
  return seaport;
}

module.exports = { getTimeBasedInfuraKey, buildSeaport };
