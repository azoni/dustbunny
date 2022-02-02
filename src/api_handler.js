const fs = require('fs')

const opensea = require("opensea-js")
const Network = opensea.Network;
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3ProviderEngine = require("web3-provider-engine");
const OpenSeaPort = opensea.OpenSeaPort;

var providerEngine = new Web3ProviderEngine();

var seaport = new OpenSeaPort(
  providerEngine,
  {
    networkName: Network.Main,
    apiKey: '9e72715b3e504813ac3ebc0512d473bf'
  },
  (arg) => console.log(arg)
);

// function get_traits_floor(traits){
// 	for(asset in assets){
// 		if(asset){

// 		}
// 	}
// }

// async function get_listed_asset(slug){
// 	var listed_assets = []
// 	var assets = await get_assets(slug)
// 	console.log(assets)

// 	for(asset in assets){
// 		if(assets[asset].sellOrders !== null){

// 		}
// 	}

// 	return listed_assets
// }

async function get_collection(slug){
	try{
		const collect = await seaport.api.get('/api/v1/collection/' + slug)
		return collect
	} catch (ex) {
		console.log("couldn't get floor")
	} 
}
async function get_assets(slug){
	// if slug exists call from json
	// else opensea api call
	var offset = 0
	var limit = 50
	var assets_length = 0
	var assets_dict = {}
	var assets_list = []

	do {
		var assets = await seaport.api.getAssets({
			'collection': slug,
			'offset': offset,
			'limit': limit,
		})
		assets.assets.forEach((asset) =>{
			assets_list.push(asset)
		})
		assets_length = assets.assets.length
		offset += 50
		console.log(offset)
	} while(assets_length === 50)

	return assets_list
}

// 
async function write_assets(slug){
	// if slug exists call from json
	// else opensea api call
	var path = './collections/' + slug + '.json'
	var offset = 0
	var limit = 50
	var assets_length = 0
	var assets_dict = {}
	var assets_list = []

	do {
		var assets = await seaport.api.getAssets({
			'collection': slug,
			'offset': offset,
			'limit': limit,
		})
		//Check for null. Ex. colection 10,000 assets, storing 10,050
		assets.assets.forEach((asset) =>{
			assets_list.push(asset)
		})
		assets_length = assets.assets.length
		//console.log(assets_list)
		offset += 50
		console.log(offset)
	} while(assets_length === 50)

	assets_dict['assets'] = assets_list
	console.log(assets_dict['assets'][0])
	const data = JSON.stringify(assets_dict);

	fs.writeFile(path, data, (err) => {
	    if (err) {
	        throw err;
	    }
	    console.log("JSON data is saved.");
	});
}

async function read_assets(slug){
	var path = './collections/' + slug + '.json'
	var asset_data = fs.readFileSync(path, "utf8")
	asset_data = JSON.parse(asset_data.toString())
	// console.log(asset_data)
	// console.log(asset_data.assets.length)
	return asset_data
}

//Asset object, BidAmount, Expiration
async function bid_asset_list(){

}

//TokenId, TokenAddress, BidAmount, Expiration
async function bid_single_collection(){

}

async function main(){
	//var assets = await get_assets('cool-cats-nft')
	//console.log(assets)
	write_assets('dapperdinosnft')
}

main()
