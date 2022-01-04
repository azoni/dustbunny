const values = require('./values.js')
const data = require('./data.js')
const { WyvernSchemaName } = require('opensea-js/lib/types')
const { buildSeaport, getTimeBasedInfuraKey } = require('./shared.js');

const ProviderEngine = require('./provider-engine.js');

var OWNER_ADDRESS = values.default.OWNER_ADDRESS[0].address
values.default.EVENT_WALLET = OWNER_ADDRESS
// Provider
if(values.default.TITLE !== undefined){
  document.getElementById('title').innerHTML = values.default.TITLE
}
if(values.default.MULTI_TRAIT !== undefined){
  document.getElementById('multitrait-2').checked = true
}

var provider_string = ''
if(values.default.ALCHEMY_KEY !== undefined){
  provider_string = 'https://eth-mainnet.alchemyapi.io/v2/' + values.default.ALCHEMY_KEY
} else {
  provider_string = "https://mainnet.infura.io/v3/" + getTimeBasedInfuraKey()
}

values.default.BLACK_LIST.push(values.default.OWNER_ADDRESS[0].username)
let providerEngine = new ProviderEngine(provider_string);
if(values.default.ALCHEMY_KEY !== undefined){
  providerEngine.start();
}
// Create seaport object using provider created.
var seaport = buildSeaport(providerEngine);

if(values.default.DEFAULT_TRAIT !== undefined){
  document.getElementById('addProperty-2').value = values.default.DEFAULT_TRAIT[0]
  document.getElementById('addTrait-2').value = values.default.DEFAULT_TRAIT[1]
}
var run_count = 0

document.getElementById('usepublic').addEventListener('click', function(){
  delay.value = 1500
  values.default.API_KEY = '2f6f419a083c46de9d83ce3dbe7db601'
  create_seaport()
})
// document.getElementById('delayStart-2').addEventListener('click', function(){

// })
var infura_index = 0

document.getElementById('infurakey').addEventListener('click', function(){
  let INFURA_KEY = values.default.INFURA_KEY[infura_index] //[parseInt(run_count)%parseInt(values.default.INFURA_KEY.length - 1)]
  providerEngine.reset('https://mainnet.infura.io/v3/' + INFURA_KEY)
  seaport = buildSeaport(providerEngine);

  infura_index += 1
  if(infura_index === values.default.INFURA_KEY.length - 1){
    infura_index = 0
  }
})

document.getElementById('increaseBid1multi-2').addEventListener('click', function(){
  if(document.getElementById('bidMultiplier-2').value !== ''){
    bidMultiplier = .005 + parseFloat(bidMultiplier)
    document.getElementById('bidMultiplier-2').value = bidMultiplier
    offerAmount = current_floor*(bidMultiplier - service_fee/10000)
    document.getElementById('offerAmount-2').value = offerAmount
  }
   if(document.getElementById('maxbidMultiplier-2').value !== ''){
    maxbidMultiplier = .005 + parseFloat(maxbidMultiplier)
    document.getElementById('maxbidMultiplier-2').value = maxbidMultiplier
    maxOfferAmount = current_floor*(maxbidMultiplier - service_fee/10000)
    document.getElementById('maxOfferAmount-2').value = maxOfferAmount
  }
})
document.getElementById('decreaseBidmulti-2').addEventListener('click', function(){
  if(document.getElementById('bidMultiplier-2').value !== ''){
    bidMultiplier = parseFloat(bidMultiplier) - .005
    document.getElementById('bidMultiplier-2').value = bidMultiplier
    offerAmount = current_floor*(bidMultiplier - service_fee/10000)
    document.getElementById('offerAmount-2').value = offerAmount
  }
   if(document.getElementById('maxbidMultiplier-2').value !== ''){
    maxbidMultiplier = parseFloat(maxbidMultiplier) - .005
    document.getElementById('maxbidMultiplier-2').value = maxbidMultiplier
    maxOfferAmount = current_floor*(maxbidMultiplier - service_fee/10000)
    document.getElementById('maxOfferAmount-2').value = maxOfferAmount
  }
})
document.getElementById('passivemulti-2').addEventListener('click', function(){
  bidMultiplier = .6
  maxbidMultiplier = .8
  document.getElementById('bidMultiplier-2').value = bidMultiplier
  document.getElementById('maxbidMultiplier-2').value = maxbidMultiplier
  if(document.getElementById('bidMultiplier-2').value !== ''){
    offerAmount = current_floor*(bidMultiplier - service_fee/10000)
    document.getElementById('offerAmount-2').value = offerAmount
  }
 if(document.getElementById('maxbidMultiplier-2').value !== ''){
    maxOfferAmount = current_floor*(maxbidMultiplier - service_fee/10000)
    document.getElementById('maxOfferAmount-2').value = maxOfferAmount
  }
})
document.getElementById('aggressivemulti-2').addEventListener('click', function(){
  bidMultiplier = .7
  maxbidMultiplier = .9
  document.getElementById('bidMultiplier-2').value = bidMultiplier
  document.getElementById('maxbidMultiplier-2').value = maxbidMultiplier
  if(document.getElementById('bidMultiplier-2').value !== ''){
    offerAmount = current_floor*(bidMultiplier - service_fee/10000)
    document.getElementById('offerAmount-2').value = offerAmount
  }
 if(document.getElementById('maxbidMultiplier-2').value !== ''){
    maxOfferAmount = current_floor*(maxbidMultiplier - service_fee/10000)
    document.getElementById('maxOfferAmount-2').value = maxOfferAmount
  }
})


function create_seaport(){
  let INFURA_KEY = getTimeBasedInfuraKey();
  console.log('creating seaport ' + INFURA_KEY)
  console.log('creating seaport ' + values.default.API_KEY)
  console.log(run_count)
  providerEngine.reset('https://mainnet.infura.io/v3/' + INFURA_KEY);
  seaport = buildSeaport(providerEngine);
}

var tokenId_array = []
var name_array = []
var asset_dict = []

function addAssetToList(id, name) {
  tokenId_array.push(id)
  name_array.push(name)    
}

var NFT_CONTRACT_ADDRESS = ''
var offerAmount = 0
var maxOfferAmount = 0
var bidMultiplier = 0
var maxbidMultiplier = 0
var expirationHours = 1
if(values.default.DEFAULT_EXPIRATION !== undefined){
  document.getElementById('expireInput-2').value = values.default.DEFAULT_EXPIRATION
  expirationHours = values.default.DEFAULT_EXPIRATION
}
if(values.default.DEFAULT_BIDS !== undefined){
  bidMultiplier = values.default.DEFAULT_BIDS[0]
  maxbidMultiplier = values.default.DEFAULT_BIDS[1]
  document.getElementById('bidMultiplier-2').value =values.default.DEFAULT_BIDS[0]
  document.getElementById('maxbidMultiplier-2').value =values.default.DEFAULT_BIDS[1]
}
var COLLECTION_NAME = ''
var offers = 0

var stop = 0
var stop2 = 0
var halt = 0

var delay = document.getElementById('delay')
// 
// Input boxes, text, buttons from frontend. 
// 
var increaseBid = document.getElementById('increaseBid-2')
var increaseBid1 = document.getElementById('increaseBid1-2')

var blacklist = values.default.BLACK_LIST
var text = document.getElementById('text-2')
var text1 = document.getElementById('text1-2')

const collectionButton = document.getElementById('collectionButton-2')
const collectionInput = document.getElementById('collectionInput-2')
const collectionButtonClear = document.getElementById('collectionButtonClear-2')

var offersMade = document.getElementById('offersMade-2')
var confirmCollection = 0
var progressBar = document.getElementById('progressBar-2')

var current_floor = 0
var service_fee = 0
var assetCount = 0
//
// Grab collection to submit offers on. 
//
var accountIndex = 0
document.getElementById('nextAccount-2').addEventListener('click', function(){
  console.log('run-collection')
  accountIndex += 1
  if(accountIndex === values.default.OWNER_ADDRESS.length){
    accountIndex = 0
  }
  OWNER_ADDRESS = values.default.OWNER_ADDRESS[accountIndex].address
  values.default.EVENT_WALLET = OWNER_ADDRESS
})
var fav_index = 0
getCollection(values.default.FAVORITES[fav_index])
document.getElementById('nextCollection-2').addEventListener('click', function(){
  fav_index += 1
  
  if(fav_index === values.default.FAVORITES.length){
    fav_index = 0
  }
  getCollection(values.default.FAVORITES[fav_index])
})

async function getCollection(collectionName){
  progressBar.value = 0
  collectionName = collectionName.trim()
  var collect = getCollectionDetails(collectionName)
  collect.then(function(collect){
    try { 
      COLLECTION_NAME = collectionName
      document.getElementById('collectionInput-2').value = COLLECTION_NAME
      if(COLLECTION_NAME === 'guttercatgang'){
        NFT_CONTRACT_ADDRESS = '0xedb61f74b0d09b2558f1eeb79b247c1f363ae452'
      }
      if(COLLECTION_NAME === 'bears-deluxe'){
        NFT_CONTRACT_ADDRESS = '0x495f947276749ce646f68ac8c248420045cb7b5e'
      } else {
        NFT_CONTRACT_ADDRESS = collect['collection']['primary_asset_contracts'][0]['address']
      }
      assetCount = collect['collection']['stats']['count']
      //window.open('https://opensea.io/collection/' + COLLECTION_NAME,'name','width=this.width,height=this.height')
      document.getElementById('collectionName-2').innerHTML = COLLECTION_NAME + ' ' +  collect['collection']['dev_seller_fee_basis_points'] / 100 + '% Floor: ' + collect['collection']['stats']['floor_price'].toFixed(3)
      // collection.innerHTML = NFT_CONTRACT_ADDRESS
      current_floor = collect['collection']['stats']['floor_price']
      service_fee = collect['collection']['dev_seller_fee_basis_points']
      document.getElementById('collectionImage-2').src = collect['collection'].image_url
      document.getElementById('collectionImage-2').style.height = "200px"
      document.getElementById('collectionImage-2').style.width = "200px"
      confirmCollection = 1
      document.getElementById('bidsActivity-2').innerHTML = "Bids"
      document.getElementById('bidsActivity-2').target = "_blank"
      document.getElementById('bidsActivity-2').href = 'https://opensea.io/activity/' + COLLECTION_NAME + '?collectionSlug=' + COLLECTION_NAME + '&search[isSingleCollection]=true&search[eventTypes][0]=AUCTION_SUCCESSFUL&search[eventTypes][1]=OFFER_ENTERED'
      document.getElementById('collectionHome-2').innerHTML = "Home"
      document.getElementById('collectionHome-2').target = "_blank"
      document.getElementById('collectionHome-2').href = 'https://opensea.io/collection/' + COLLECTION_NAME
      document.getElementById('assetFloor-2').innerHTML = "Floor"
      document.getElementById('assetFloor-2').target = "_blank"
      document.getElementById('assetFloor-2').href = 'https://opensea.io/collection/' + COLLECTION_NAME + '?search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW'

    } catch(ex) {
      console.log(ex)
      document.getElementById('collectionName-2').innerHTML = ''
      document.getElementById('collectionImage-2').src = ''
      NFT_CONTRACT_ADDRESS = ''
      // collection.innerHTML = collectionName + " don't exist." + NFT_CONTRACT_ADDRESS
      confirmCollection = 0
    }
    quickButton.disabled = true
    increaseBid.disabled = true
    increaseBid1.disabled = true
  if(document.getElementById('bidMultiplier-2').value !== ''){
    offerAmount = current_floor*(bidMultiplier - service_fee/10000)
    document.getElementById('offerAmount-2').value = offerAmount
  }
 if(document.getElementById('maxbidMultiplier-2').value !== ''){
    maxOfferAmount = current_floor*(maxbidMultiplier - service_fee/10000)
    document.getElementById('maxOfferAmount-2').value = maxOfferAmount
  }
  })
}

collectionButtonClear.addEventListener('click', function(){
  COLLECTION_NAME = ''
  confirmCollection = 0
  quickButton.disabled = true
  document.getElementById('collectionName-2').innerHTML = ''
    // collection.innerHTML = 'Collection Address:'
    document.getElementById('collectionImage-2').src = 'https://cdn-images-1.medium.com/max/1200/1*U0m-Cl7qvflUX4QmdIdzoQ.png'
    document.getElementById('collectionImage-2').style.height = '200px'
    document.getElementById('collectionImage-2').style.width = '200px'
    collectionInput.value = ''
    document.getElementById('bidsActivity-2').innerHTML = ""
    document.getElementById('bidsActivity-2').target = "_blank"
    document.getElementById('bidsActivity-2').href = 'https://opensea.io/activity/' + COLLECTION_NAME + '?collectionSlug=' + COLLECTION_NAME + '&search[isSingleCollection]=true&search[eventTypes][0]=AUCTION_SUCCESSFUL&search[eventTypes][1]=OFFER_ENTERED'
    document.getElementById('collectionHome-2').innerHTML = ""
    document.getElementById('collectionHome-2').target = "_blank"
    document.getElementById('collectionHome-2').href = 'https://opensea.io/collection/' + COLLECTION_NAME
    document.getElementById('assetFloor-2').innerHTML = ""
    document.getElementById('assetFloor-2').target = "_blank"
    document.getElementById('assetFloor-2').href = 'https://opensea.io/collection/' + COLLECTION_NAME + '?search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW'
  })

collectionButton.addEventListener('click', function(){
  getCollection(collectionInput.value)
})
if(values.default.DEFAULT_FRACTION !== undefined){
  document.getElementById(values.default.DEFAULT_FRACTION).checked = true
}

increaseBid.addEventListener('click', function(){
  offerAmount = .01 + parseFloat(offerAmount)
  document.getElementById('offerAmount-2').value = offerAmount
})
increaseBid1.addEventListener('click', function(){
  offerAmount = .001 + parseFloat(offerAmount)
  document.getElementById('offerAmount-2').value = offerAmount
})

////////////////////////////////////////////////
const confirmButton = document.getElementById('confirmButton-2')
const quickButton = document.getElementById('quickStart-2')

quickButton.disabled = true
increaseBid.disabled = true
increaseBid1.disabled = true

quickButton.addEventListener('click', function(){
  document.getElementById('body').style.background = '#90EE90'
  reset()
  start()
  progressBar.value =  0
  run_count = 0
  document.getElementById('nextCollection-2').disabled = true
  quickButton.disabled = true
  progressBar.hidden = false
  increaseBid.disabled = false
  increaseBid1.disabled = false
  progressBar.max = assetCount
  run()
})
document.getElementById('smartStart-2').addEventListener('click', function(){
  test_bid()
})
async function test_bid(){
  const asset = {
    tokenId: '1690',
    tokenAddress: '0x1cb1a5e65610aeff2551a50f76a87a7d3fb649c6',
    //schemaName: WyvernSchemaName.ERC1155
  }
  try{
    text.style.color = 'black'
    text.innerHTML = 'Testing bid...'
    providerEngine.start()
    await seaport.createBuyOrder({
      asset,
      startAmount: .0001,
      accountAddress: OWNER_ADDRESS,
      expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * .01),
    })
    text.style.color = 'black'
    text.innerHTML = 'Bid Successful'

  } catch(ex){
    console.log(ex)
    console.log(ex.message)
    text.style.color = 'red'
    text.innerHTML = ex.message
  }
  providerEngine.stop()
}

var offersDict = {}
confirmButton.addEventListener('click', function(){
  if (confirmCollection === 1) {
    var traitsDiv = document.getElementById('traitsDiv-2')
    offersDict = {}
    for (const property in traitsDiv.children) {
      try {
        if(traitsDiv.children[property].id.includes('property')){
          offersDict[traitsDiv.children[property].value] = [traitsDiv.children[parseInt(property+1)].value, traitsDiv.children[parseInt(property+2)].value]
        }
      } catch (ex) {
      }
    }
    offerAmount = document.getElementById('offerAmount-2').value
    if (document.getElementById('maxOfferAmount-2').value === ''){
      maxOfferAmount = 0
    } else {
      maxOfferAmount = document.getElementById('maxOfferAmount-2').value
    }

    expirationHours = document.getElementById('expireInput-2').value
    if(expirationHours === '') {
     expirationHours = 1
   }
   if(document.getElementById('bidMultiplier-2').value !== ''){
    bidMultiplier = document.getElementById('bidMultiplier-2').value
    
    console.log(current_floor)
    console.log(current_floor*bidMultiplier)
    console.log(current_floor*(bidMultiplier - service_fee/10000))
  
    offerAmount = current_floor*(bidMultiplier - service_fee/10000)
    
    document.getElementById('offerAmount-2').value = offerAmount
  }
  if(document.getElementById('maxbidMultiplier-2').value !== ''){
    console.log(current_floor*maxbidMultiplier)
    console.log(current_floor*(maxbidMultiplier - service_fee/10000))  
    maxbidMultiplier = document.getElementById('maxbidMultiplier-2').value
    maxOfferAmount = current_floor*(maxbidMultiplier - service_fee/10000)
    document.getElementById('maxOfferAmount-2').value = maxOfferAmount
  }
   if (offerAmount === ''){
    alert('No bid entered.')
    return
  }
  quickButton.disabled = false

  if(document.getElementById('multitrait-2').checked === true){

    var trait_dict = values.default.COLLECTION_TRAIT
    if (values.default.USE_DATA !== undefined){
      trait_dict = data.default.COLLECTION_TRAIT
      values.default.COLLECTION_TRAIT = data.default.COLLECTION_TRAIT
      console.log(values.default.COLLECTION_TRAIT)
    }
    console.log(COLLECTION_NAME)
    var output = offerAmount + ' min ' + maxOfferAmount + ' max Bid for : ' + COLLECTION_NAME + " " + expirationHours + " hour expiration."
    output += '\n' + current_floor
    for(var i in trait_dict[COLLECTION_NAME]){
      console.log(i)
      for(var j in trait_dict[COLLECTION_NAME][i]){
        output += '\n' + i + ': ' + j + ' - ' + ((trait_dict[COLLECTION_NAME][i][j][0] - service_fee/10000) * current_floor).toFixed(4) + ' - ' + 
        ((trait_dict[COLLECTION_NAME][i][j][1] - service_fee/10000) * current_floor).toFixed(4)
      }
    }
    if(values.default.AUTOSTART === 1){
      return 0
    }
    alert(output)
  } else {
    if(values.default.AUTOSTART === 1){
      return 0
    }

    alert(offerAmount + ' min ' + maxOfferAmount + ' max Bid for : ' + COLLECTION_NAME + " " + expirationHours + " hour expiration.")
  }
  

  } else {
    alert('Get valid collection first.')
  }
})

async function getCollectionDetails(collectionName){
  try{
    const collect = await seaport.api.get('/api/v1/collection/' + collectionName)
    return collect
  } catch (ex) {
    console.log("couldn't get collection")
  }  
}
function update_floor(){
  if(COLLECTION_NAME !== ''){
    getCollectionDetails(COLLECTION_NAME).then(function (collect){
      try{
      document.getElementById('collectionName-2').innerHTML = COLLECTION_NAME + ' ' +  collect['collection']['dev_seller_fee_basis_points'] / 100 + '% Floor: ' + collect['collection']['stats']['floor_price']
      current_floor = collect['collection']['stats']['floor_price']
      service_fee = collect['collection']['dev_seller_fee_basis_points']
       if(document.getElementById('bidMultiplier-2').value !== ''){
        console.log(current_floor*bidMultiplier)
        console.log(current_floor*(bidMultiplier - service_fee/10000))
        offerAmount = current_floor*(bidMultiplier - service_fee/10000)
        document.getElementById('offerAmount-2').value = offerAmount
      }
       if(document.getElementById('maxbidMultiplier-2').value !== ''){
        console.log(current_floor*maxbidMultiplier)
        console.log(current_floor*(maxbidMultiplier - service_fee/10000))
        maxOfferAmount = current_floor*(maxbidMultiplier - service_fee/10000)
        document.getElementById('maxOfferAmount-2').value = maxOfferAmount
      }
      console.log('Floor updated: ' + collect['collection']['stats']['floor_price'])
    } catch(ex){
      console.log(ex.message)
    }
    })

  } else {
    console.log('No Collection selected.')
  }
}
text.style.fontSize = '20px'
text1.style.fontSize = '20px'
// var midrun = false

///////////////////////////////////////////////////////////////////////////////////
///********************************************************************************
///This function is responsible for generating the assets to be bid on. 
///Ex. multi trait bidding, fractional runs on set.
async function run() {
  if(document.getElementById('delayStart-2').value !== ''){
    text.innerHTML = 'Starting in ' + document.getElementById('delayStart-2').value + ' minutes.'
    await new Promise(resolve => setTimeout(resolve, document.getElementById('delayStart-2').value * 60000));
    reset()
  }

  var direction = 'asc'
  text.innerHTML = 'Starting.....'


  var collectionName = COLLECTION_NAME.trim()
  console.log(assetCount)
  // assetCount = assetCount/2
  var offset = 0
  if(document.getElementById('secondhalf').checked === false){
    if(document.getElementById('firstquarter').checked === true){
      assetCount = Math.floor(assetCount/2)
    }
    if(document.getElementById('firsteighth').checked === true){
      assetCount = Math.floor(assetCount/4)
    }
    if(document.getElementById('secondeighth').checked === true){
      offset += Math.floor(assetCount/8)
      assetCount = Math.floor(assetCount/2)
    }
    if(document.getElementById('thirdeighth').checked === true){
      offset += Math.floor(assetCount/8)
      offset += Math.floor(assetCount/8)
      assetCount = Math.floor(assetCount/2) + Math.floor(assetCount/4)
    }
    if(document.getElementById('fourtheighth').checked === true){
      offset += Math.floor(assetCount/8)
      offset += Math.floor(assetCount/8)
      offset += Math.floor(assetCount/8)
      //assetCount = Math.floor(assetCount/2) + Math.floor(assetCount/4) + Math.floor(assetCount/4)
    }
    if(document.getElementById('secondquarter').checked === true){
      offset += Math.floor(assetCount/4)
    }
    for(offset; offset < Math.floor(assetCount/2); offset+=50){
      if(document.getElementById('thirdquarter').checked === true || document.getElementById('fourthquarter').checked === true 
        || document.getElementById('fiftheighth').checked === true || document.getElementById('sixtheighth').checked === true
        || document.getElementById('seventheighth').checked === true || document.getElementById('eightheighth').checked === true
        ){
        break
      }
      if(halt === 1) {
        break
      }
      //await new Promise(resolve => setTimeout(resolve, 5000))
      await fetchAndProcessCollection(collectionName, offset, direction);
      console.log(tokenId_array.length)
      text.innerHTML = tokenId_array.length + '(' + offset + ') of ' + assetCount + ' collected'
    }
  }
  direction = 'desc'
  var temp_offset = offset
  offset = 0

  if(document.getElementById('fourthquarter').checked === true){
    assetCount = Math.floor(assetCount/2)
  }
  if(document.getElementById('thirdquarter').checked === true){
    offset += Math.floor(assetCount/4)
  }
    if(document.getElementById('eightheighth').checked === true){
      assetCount = Math.floor(assetCount/4)
    }
    if(document.getElementById('seventheighth').checked === true){
      offset += Math.floor(assetCount/8)
      assetCount = Math.floor(assetCount/2)
    }
    if(document.getElementById('sixtheighth').checked === true){
      offset += Math.floor(assetCount/8)
      offset += Math.floor(assetCount/8)
      assetCount = Math.floor(assetCount/2) + Math.floor(assetCount/4)
    }
    if(document.getElementById('fiftheighth').checked === true){
      offset += Math.floor(assetCount/8)
      offset += Math.floor(assetCount/8)
      offset += Math.floor(assetCount/8)
      //assetCount = Math.floor(assetCount/2) + Math.floor(assetCount/4) + Math.floor(assetCount/4)
    }

///////////////////////////////////////////////////////////////////////////////////
///********************************************************************************
///Run through second half of collection in decending order
  if(document.getElementById('firsthalf').checked === false){
    for(offset; offset < assetCount/2; offset+=50){
      if(document.getElementById('firstquarter').checked === true || document.getElementById('secondquarter').checked === true
        || document.getElementById('firsteighth').checked === true || document.getElementById('secondeighth').checked === true
        || document.getElementById('thirdeighth').checked === true || document.getElementById('fourtheighth').checked === true){
        break
      }
      if(halt === 1) {
        break
      }
      //await new Promise(resolve => setTimeout(resolve, 5000))
      await fetchAndProcessCollection(collectionName, offset, direction);
      console.log(tokenId_array.length)
      text.innerHTML = tokenId_array.length + '(' + (parseInt(offset) + temp_offset) + ') of ' + assetCount + ' collected'
    }
  }
  if(document.getElementById('reverse-2').checked){
    tokenId_array.reverse()
    name_array.reverse()
  }
  if(halt === 1) {
    offers = 0
    progressBar.value = 0
    maxOfferAmount = 0
    offerAmount = 0
    expirationHours = 0
    text.innerHTML = ''
    text1.innerHTML = ''
    increaseBid.disabled = true
    increaseBid1.disabled = true
    quickButton.disabled = true
    progressBar.hidden = true
    offersMade.innerHTML = ''
    tokenId_array = []
    name_array = []
    halt = 0
    return 0
  }
  assetCount = tokenId_array.length - 1
  progressBar.max = assetCount
  pause()
  reset()
  start()
  stop = 0
  stop2 = 0
  halt = 0
  console.log(asset_dict)
  //testbundlebid()
  console.log(tokenId_array)
    placeBid()
  if(values.default.API_KEY !== '2f6f419a083c46de9d83ce3dbe7db601'){// && midrun === false){
    placeBid2()
  
  }
}
/**
 * Fetch a collection with some search and sort parameters and process the collection in preperation for bidding.
 * @param {string} collectionName - name of collection to query.
 * @param {number} offset - offset for the getAssets query.
 * @param {string} direction - Either 'asc' or 'desc'. Sort order of query.
 */
async function fetchAndProcessCollection(collectionName, offset, direction) {
  try {
    let collection = await seaport.api.getAssets({
      'collection': collectionName,
      'offset': offset,
      'limit': '50',
      'order_direction': direction
    })
    console.log(collection)
    selectAssetsFromCollection(collection);
  } catch (ex){
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(ex)
  }
}
/**
 * Based on the parameters given to bot makes a list of assets that meet the requirements.
 * @param {} collection - response from seaport.api.getAssets
 */
function selectAssetsFromCollection(collection) {
  for (let asset of collection.assets) {
    let traitNameField = document.getElementById('addProperty-2').value;
    // if we are buying only listed nfts and there are no specified traits we want
    if (document.getElementById('sellOrder-2').checked && traitNameField === '') {
      if (asset.sellOrders !== null) {
        let aboveFloorValue = document.getElementById('aboveFloor-2').value;
        let topSaleOrderPrice = asset.sellOrders[0].basePrice/1000000000000000000;
        if (aboveFloorValue === '' || topSaleOrderPrice < current_floor * aboveFloorValue) { // ignore items that are listed for too high
          console.log(topSaleOrderPrice);
          addAssetToList(asset.tokenId, asset.name);
        }
      }
    } else if (traitNameField !== '') { // trait name and value text field in bot ui populated
      for (const trait of asset.traits) {
        if (trait['trait_type'].toLowerCase().includes(traitNameField) && trait['value'].toLowerCase().includes(document.getElementById('addTrait-2').value)) {
          if (document.getElementById('sellOrder-2').checked === false) { // include all unlisted and listed nfts
            addAssetToList(asset.tokenId, asset.name);
          } else if (asset.sellOrders !== null) { // include only listed nfts
            addAssetToList(asset.tokenId, asset.name);
          }
        }
      }
    } else if (document.getElementById('multitrait-2').checked === true || document.getElementById('traitskip-2').checked === true) { // we have a list of traits to search or skip ( at this point listed was not checked)
      let traitfound = false;
      let traitsToSearchFor = values.default.COLLECTION_TRAIT[COLLECTION_NAME]; // bid range data for traits we're searching for
      for (const trait of asset.traits) { // for each trait on the asset
        for (const trait_name in traitsToSearchFor) { // and for each trait in our traitsToSearchFor map
          if (trait['trait_type'].toLowerCase().includes(trait_name)) { //trait_type is the name of the trait. is the trait name in our traitsToSearchFor
            for (const trait_val in traitsToSearchFor[trait_name]) { // for each trait value we are interested in
              if (trait['value'].toLowerCase().includes(trait_val)) { // is the asset trait value in our traitsToSearchFor
                traitfound = true;
                const traitBidRange = traitsToSearchFor[trait_name][trait_val];
                // set trait bid range or update range if asset has another higher value trait
                if (Object.keys(asset_dict).includes(asset.tokenId) === false) {
                  asset_dict[asset.tokenId] = traitBidRange;
                } else if (asset_dict[asset.tokenId][0] < traitBidRange[0]) {
                  asset_dict[asset.tokenId] = traitBidRange;
                }
              }
            }
          }
        }
      }
      if (traitfound === true && document.getElementById('traitskip-2').checked === false) {
        addAssetToList(asset.tokenId, asset.name);
      }
      if (traitfound === false && document.getElementById('traitsonly-2').checked === false) {
        addAssetToList(asset.tokenId, asset.name);
      }
    } else { // all listed or unlisted. no multitraits to search for. no traits specified in ui
      addAssetToList(asset.tokenId, asset.name);
    }
  }
}

function check_errors(msg){
  if(msg.includes('Insufficient balance.')){
    beep(4);
    return 'Insufficient balance. Please wrap more ETH.'
    //alert('Insufficient balance. Please wrap more ETH.')
  }
  else if(msg.includes('Invalid JSON RPC response')){
    return 'Invalid JSON RPC response'
  }
  else if(msg.includes('This order does not have a valid bid price for the auction')){
    return 'Auction'
  }
  else if(msg.includes('API Error 404: Not found.')){
    return 'Asset not found.'
  } else if(msg.includes('Trading is not enabled for')){
    return 'Trading not enalbed on asset.'
  } else if(msg.includes('Internal server error')){
    return 'Internal server error.'
  } else if(msg.includes('Not enough token approved for trade')){
      create_seaport()
    return 'Out of Infura requests.. swappinp keys.'
  } else if(msg.includes('has too many outstanding orders.') || msg.includes('Outstanding order to wallet balance')){
      beep()

    return 'Too many outstanding orders.'
  } else if(msg.includes('Bid amount is not 5.0% higher than the previous bid')){
    return 'Bid amount is not 5.0% higher than the previous bid'
  } else if(msg.includes('Cannot read properties of undefined')){
      return "Cannot read properties of undefined"
  }
  return 0
}

function getUsernameFromOrder(order) {
  let username = order?.makerAccount?.user?.username || 'No-User';
  if (username !== 'No-User') { console.log(username); }
  return username;
}

async function coreBidLogic(i) {
  const curr_tokenId = tokenId_array[i];
  const curr_name = name_array[i];
  await new Promise(resolve => setTimeout(resolve, delay.value))
  let offset = 0
  let highestBid = 0;
  let topBid = undefined;
  if (maxOfferAmount !== 0) {
    let username = 'No-User'
    try {
      while(values.default.EVENT === 1) {
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
      const { orders } = await seaport.api.getOrders({
        asset_contract_address: NFT_CONTRACT_ADDRESS,
        token_id: curr_tokenId,
        side: 0,
        order_by: 'eth_price',
        order_direction: 'desc',
        limit: 50
      })
      if (orders.length !== 0) {
        topBid = orders[0].basePrice / 1000000000000000000
        highestBid = topBid;
        username = getUsernameFromOrder(orders[0]);

        for (const ord of orders) { // set top bid to top bid below max offer from a non blacklisted user
          username = getUsernameFromOrder(ord);
          if (blacklist.includes(username) === false && parseFloat(ord.basePrice / 1000000000000000000) <= parseFloat(maxOfferAmount)) {
            topBid = ord.basePrice / 1000000000000000000;
            break;
          }
        }
        if (parseFloat(topBid) < parseFloat(maxOfferAmount) && parseFloat(topBid) >= parseFloat(offerAmount)) {
          offset = .001 + parseFloat(topBid - offerAmount)
        }
        console.log('top bid: ' + topBid + ' #' + curr_name)
      } else {
        console.log('No bids found.')
        text1.innerHTML = 'No bids found.'
      }
    } catch(ex) {
      console.log(ex.message)
      console.log('Get bids for ' + curr_name + ' failed.')
    }
    await new Promise(resolve => setTimeout(resolve, delay.value))
  }
  let asset = {
    tokenId: curr_tokenId,
    tokenAddress: NFT_CONTRACT_ADDRESS,
  }
  const wyvernCollections = [ 'bears-deluxe', 'guttercatgang', 'clonex-mintvial' ];
  if (wyvernCollections.includes(COLLECTION_NAME)) {
    asset = {
      ...asset,
      schemaName: WyvernSchemaName.ERC1155
    }
  }
  let placebidoffer = parseFloat(offset) + parseFloat(offerAmount);
  if (document.getElementById('multitrait-2').checked === true && (curr_tokenId in asset_dict)) {
    placebidoffer = (asset_dict[curr_tokenId][0] - service_fee/10000) * current_floor
    const highestTraitBid = (asset_dict[curr_tokenId][1] - service_fee/10000) * current_floor;
    if (placebidoffer < highestBid && highestBid < highestTraitBid) {
      placebidoffer = .001 + parseFloat(highestBid);
    }
  }
  try {
    if (parseFloat(placebidoffer) > parseFloat(values.default.ABSOLUTE_MAX)) {
      document.getElementById('repeat-2').checked = false
      text.style.color = 'red'
      text.innerHTML = 'Something went horribly wrong.. ' + curr_name + ' ' + placebidoffer
      beep(15);
      return 1;
    }
    await seaport.createBuyOrder({
      asset,
      startAmount: placebidoffer,
      accountAddress: OWNER_ADDRESS,
      expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * expirationHours),
    })
    console.log('Success #' + curr_name + ': ' + placebidoffer)
    text.style.color = 'black'
    text.innerHTML = 'bidding: ' + placebidoffer.toFixed(5) + " on " + curr_name
    if (maxOfferAmount !== 0 && topBid !== undefined) {
      text1.style.color = 'black'
      text1.innerHTML = 'top bid: ' + topBid.toFixed(5) + '(' + highestBid.toFixed(5) + ') #' + curr_name
    }
  } catch(ex) {
    console.log(ex)
    console.log(ex.message)
    console.log(ex.code)
    if (ex.code === -32603) {
      create_seaport()
    }
    var error_message = check_errors(ex.message)
    text.style.color = 'red'
    text.innerHTML = error_message
    if (error_message === 'Too many outstanding orders.') {
      await new Promise(resolve => setTimeout(resolve, 30000))
    }
    if (error_message === 'Insufficient balance. Please wrap more ETH.') {
      await new Promise(resolve => setTimeout(resolve, 180000))
    }
    if (error_message === 0 && halt === 0) {
      text.innerHTML = 'Error.. retrying'
      console.log('**FAILED**! #' + curr_name)
      await new Promise(resolve => setTimeout(resolve, 60000))
    }
  }
  offers+=1
  progressBar.value += 1
  offersMade.style.fontSize = '20px'
  offersMade.innerHTML = offers + '/' + progressBar.max 
  if (offers % 100 === 0) {
    update_floor()
    //buy_order()
  }
  if (halt === 1) {
    return 1;
  }
}

async function placeBid() {
  if (values.default.ALCHEMY_KEY === undefined) {
    create_seaport()
  }
  run_count++;
  if (values.default.API_KEY === '2f6f419a083c46de9d83ce3dbe7db601') {
    assetCount *= 2
    stop2 = 1
  }
  await new Promise(resolve => setTimeout(resolve, 2000))
  for (let i = 0; i < Math.floor(assetCount/2); i++) {
    if (await coreBidLogic(i) === 1) { break; }
  }
  if (halt === 1) {
    return 0
  }
  stop = 1
  continueParallelBidding();
}
async function placeBid2(){
  await new Promise(resolve => setTimeout(resolve, 1000))
  // if(maxOfferAmount !== 0 && values.default.API_KEY !== '2f6f419a083c46de9d83ce3dbe7db601') {
  //   delay.value = 250
  // }
  for (let i = Math.floor(assetCount/2); i < assetCount; i++) {
    if (await coreBidLogic(i) === 1) { break; }
  }
  if (halt === 1) {
    return 0;
  }
  stop2 = 1;
  continueParallelBidding();
}

function continueParallelBidding() {
  if (stop === 1 && stop2 === 1) {
    pause()
    document.getElementById('body').style.background = "#E6FBFF"
    if (document.getElementById('repeat-2').checked) {
      document.getElementById('body').style.background = '#90EE90'
      stop = 0
      stop2 = 0
      offers = 0
      progressBar.value = 0
      reset()
      start()
      placeBid()
      placeBid2()
    }
  }
}
///////////////////////////////////////////////////////////////////////////////////
///********************************************************************************
///Doesn't work. 
document.getElementById('reset-2').addEventListener('click', function(){ 
  reset()
  document.getElementById('assetCount').value = ''
  // document.getElementById('toprun').checked = false
  halt = 1
  offers = 0
  progressBar.value = 0
  maxOfferAmount = 0
  offerAmount = 0
  expirationHours = 0
  text.innerHTML = ''
  text1.innerHTML = ''
  increaseBid.disabled = true
  increaseBid1.disabled = true
  quickButton.disabled = true
  document.getElementById('nextCollection-2').disabled = false
  progressBar.hidden = true
  offersMade.innerHTML = ''
  tokenId_array = []
  name_array = []
})

// Convert time to a format of hours, minutes, seconds, and milliseconds
function timeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);

  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);

  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);

  let diffInMs = (diffInSec - ss) * 100;
  let ms = Math.floor(diffInMs);

  let formattedHH = hh.toString().padStart(2, "0");
  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");
  let formattedMS = ms.toString().padStart(2, "0");

  return `${formattedHH}:${formattedMM}:${formattedSS}:${formattedMS}`;
}
// Declare variables to use in our functions below
let startTime;
let elapsedTime = 0;
let timerInterval;

// Create function to modify innerHTML
function print(txt) {
  document.getElementById("display-2").innerHTML = txt;
}
// Create "start", "pause" and "reset" functions
function start() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(function printTime() {
    elapsedTime = Date.now() - startTime;
    print(timeToString(elapsedTime));
  }, 10);
}

function pause() {
  clearInterval(timerInterval);
}
function reset() {
  clearInterval(timerInterval);
  print("00:00:00:00");
  elapsedTime = 0;
}
function beep(times = 1) {
  for (let i = 0; i < times; i++) {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
  }
}