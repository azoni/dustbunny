const values = require('./values.js')
const data = require('./data.js')
const secret = require('./secret.js')
const opensea = require("opensea-js")
// import { createClient } from 'redis';
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;
const { WyvernSchemaName } = require('opensea-js/lib/types')

const MnemonicWalletSubprovider = require("@0x/subproviders")
.MnemonicWalletSubprovider;
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3ProviderEngine = require("web3-provider-engine");
const MNEMONIC = secret.default.MNEMONIC
const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
  mnemonic: MNEMONIC,
});
var provider_string = ''
if(values.default.ALCHEMY_KEY !== undefined){
  provider_string = 'https://eth-mainnet.alchemyapi.io/v2/' + values.default.ALCHEMY_KEY
} else {
  var currentHour = new Date().getHours()
  var INFURA_KEY = values.default.INFURA_KEY[Math.floor(currentHour/3)]
  if(values.default.INFURA_KEY.length === 6){
    INFURA_KEY = values.default.INFURA_KEY[Math.floor(currentHour/4)]
  } else if(values.default.INFURA_KEY.length === 4){
    INFURA_KEY = values.default.INFURA_KEY[Math.floor(currentHour/6)]
  }else if(values.default.INFURA_KEY.length === 5){
    INFURA_KEY = values.default.INFURA_KEY[Math.floor(currentHour/5)]
  }
  provider_string = "https://mainnet.infura.io/v3/" + INFURA_KEY
}
var infuraRpcSubprovider = new RPCSubprovider({
  rpcUrl: provider_string
});

var providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(mnemonicWalletSubprovider);
providerEngine.addProvider(infuraRpcSubprovider);

values.default.OWNER_ADDRESS = data.default.OWNER_ADDRESS

var seaport = new OpenSeaPort(

  providerEngine,
  {
    networkName: Network.Main,
    apiKey: values.default.API_KEY
  },
  (arg) => console.log(arg)
);
var Eth = require('web3-eth');

var eth = new Eth(providerEngine)
get_gas()

async function get_gas(){
	let gas = await eth.getGasPrice()
	document.getElementById('gas').innerHTML = ' gwei: ' + (gas/1000000000).toFixed(0)
}

providerEngine.start()
function change_seaport(MNEMONIC){
	providerEngine.stop()
	const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
	  mnemonic: MNEMONIC,
	});
	providerEngine = new Web3ProviderEngine();
	providerEngine.addProvider(mnemonicWalletSubprovider);
	providerEngine.addProvider(infuraRpcSubprovider);
	seaport = new OpenSeaPort(
	  providerEngine,
	  {
	    networkName: Network.Main,
	    apiKey: values.default.API_KEY
	  },
	  (arg) => console.log(arg)
	);
	providerEngine.start()
}

document.getElementById('swap').addEventListener('click', swap)

function swap(){
	if(document.getElementById('account_name').innerHTML === 'Azoni'){
		document.getElementById('account_name').innerHTML = 'DustBunny'
		const MNEMONIC = secret.default.MNEMONIC
		change_seaport(MNEMONIC)
		ADDRESS = '0xb1cbed4ab864e9215206cc88c5f758fda4e01e25'
	} else {
		document.getElementById('account_name').innerHTML = 'Azoni'
		const MNEMONIC = secret.default.MNEMONIC2
		change_seaport(MNEMONIC)
		ADDRESS = '0xcae462347cd2d83f9a548afacb2ca6e0c6063bff'
	}
}
var acct_dict = {}
// document.getElementById('test').addEventListener('click', async function(){
// 	for(var address of values.default.OWNER_ADDRESS){
// 		if(address.username === 'DustBunny'){
// 			swap()
// 		}
// 		var success = await test_bid(address.address)
// 		if(success === 'success'){
// 			acct_dict['can_run'] = true 
// 		} else{
// 			acct_dict['can_run'] = false
// 		}
// 		console.log(address.username + ' ' + success) 
// 	}	
// 	swap()
// 	console.log(acct_dict)
// })
async function test_bid(address){
	var asset = {
	  tokenId: '8573',
	  tokenAddress: '0x24998f0a028d197413ef57c7810f7a5ef8b9fa55',
	  //schemaName: WyvernSchemaName.ERC1155
	}
	try{
	  await seaport.createBuyOrder({
		asset,
		startAmount: 0,
		accountAddress: address,
		expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * .01),
	  })
	  return 'success'
	} catch(ex){
		//console.log(ex)
	}
	return 'fail'
}
document.getElementById('unstake').addEventListener('click', function(){	
	test_unstake_bid()
})
// document.getElementById('refresh').addEventListener('click', function(){	
// 	display()
// })
document.getElementById('display').addEventListener('click', function(){	
	get_nfts()
})
// document.getElementById('running').addEventListener('click', function(){	
// 	current_running()
// })
async function current_running(account){
	let search_time = Math.floor(+new Date()) - 9000
	search_time = new Date(search_time).toISOString();
	console.log('Current running accounts...')
  await new Promise(resolve => setTimeout(resolve, 1000))
 //console.log(address) 
  try{
	const order = await seaport.api.getOrders({
	  side: 0,
	  order_by: 'created_date',
	  maker: account.address,
	  listed_after: search_time,
	  limit: 10,
	})
	var col_list = []
	if(order.orders.length > 0){
		for(let o of order.orders){
			if(col_list.includes(o.asset.collection.slug) === false){
				col_list.push(o.asset.collection.slug)
			}
		}
		var return_val = ''
		for(let c of col_list){
			return_val += "<a href=https://opensea.io/collection/" + c + " target=_blank>" + c + "</a>" + '<br>'
		}
		return return_val//order.orders[0].asset.collection.slug
		console.log(account.username + ' ' + order.orders[0].asset.collection.slug)
	} else {
		return false
	}
  }
  catch(ex) {
	console.log(ex.message)
  }
	console.log('Complete') 
}
function get_available_accounts(){

}
//AXQRW5QJJ5KW4KFAKC9UH85J9ZFDTB95KQ - etherscan apikey
const API_KEY = 'AXQRW5QJJ5KW4KFAKC9UH85J9ZFDTB95KQ'
var ADDRESS = '0xcae462347cd2d83f9a548afacb2ca6e0c6063bff'

var balance = 0
var weth_balance = 0
async function get_balance(address){
	try {
		const response = await fetch('https://api.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + API_KEY);
		const data = await response.json()
		balance = parseFloat(balance) + parseFloat(data.result/1000000000000000000)
		//   console.log(balance)
		document.getElementById('account').innerHTML = balance.toFixed(4) + ' ETH ' + weth_balance.toFixed(4) + ' WETH'
		return parseFloat(data.result/1000000000000000000)
	} catch (error) {
	  console.log('Looks like there was a problem: ', error);
	}
}
async function get_weth_balance(address){
	try {
		const response = await fetch('https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&address=' + address + '&tag=latest&apikey=' + API_KEY)
		const data = await response.json()
		weth_balance = parseFloat(weth_balance) + parseFloat(data.result/1000000000000000000)
		//   console.log(weth_balance)
		return parseFloat(data.result/1000000000000000000)
	} catch (error) {
	  console.log('Looks like there was a problem: ', error);
	}	
}
let text_area = document.getElementById('textarea')
//account for account running multiple sets
document.getElementById('balances').addEventListener('click', async function(){
	swap()
	var table1 = document.getElementById('table1-body')
	var table2 = document.getElementById('table2-body')
	var table3 = document.getElementById('table3-body')

	
	for(var account of values.default.OWNER_ADDRESS){
		if(account.username === 'Azoni'){
			continue
		}
		var running = await current_running(account)
		var acct = {}
		var success = await test_bid(account.address)
		if(success === 'success'){
			acct['can_run'] = true 
		} else{
			acct['can_run'] = false
		}

		var bal = await get_balance(account.address)
		await new Promise(resolve => setTimeout(resolve, 500))
		var weth_bal = await get_weth_balance(account.address)
		if(weth_bal < .003){
			var tr = document.createElement("tr");
			var td = document.createElement("td");
			td.innerHTML = account.username
			if(acct['can_run']){
				tr.style.backgroundColor = 'lightgreen'
				tr.appendChild(td)
				table2.appendChild(tr)
			} else {
				tr.style.backgroundColor = 'pink'
				tr.appendChild(td)
				table3.appendChild(tr)
			}
			
		} else {
			var tr = document.createElement("tr");
			var td1 = document.createElement("td");
			var td2 = document.createElement("td");
			var td3 = document.createElement("td");

			td1.innerHTML = account.username
			td2.innerHTML = weth_bal.toFixed(2)

			if(running === false){
				tr.style.backgroundColor = 'pink'
				if(acct['can_run']){
					tr.style.backgroundColor = 'yellow'
				}
				td3.innerHTML = '-----'
			} else {
				tr.style.backgroundColor = 'lightgreen'
				td3.innerHTML = running
			}

			tr.appendChild(td1)
			tr.appendChild(td2)
			tr.appendChild(td3)
			table1.appendChild(tr)
		}
		acct['running'] = running
		acct['username'] = account.username
		acct['weth_balance'] = weth_bal.toFixed(4)
		acct['eth_balance'] = bal.toFixed(4)
		acct_dict[account.username] = acct
		console.log(account.username + ' WETH: ' + weth_bal.toFixed(4) + ' ETH: ' + bal.toFixed(4))
		// text_area.innerHTML += account.username + ' ' + weth_bal.toFixed(2) + ' ' + success + ' ' + running + '<br>'
	}
	
	// console.log("Eth: " + balance)
	// console.log("Weth: " + weth_balance)
	// console.log(acct_dict)
	swap()

})

var staking_sets = {
	'sneaky-vampire-syndicate' : '0x12753244901f9e612a471c15c7e5336e813d2e0b',
	'sappy-seals': '0xdf8a88212ff229446e003f8f879e263d3616b57a',
	'metroverse': '0xab93f992d9737bd740113643e79fe9f8b6b34696',
	'genesis-creepz': '0xc3503192343eae4b435e4a1211c5d28bf6f6a696',
	'coolmonkes': '0xed6552d7e16922982bf80cf43090d71bb4ec2179',
	'anonymice': '0x000000000000000000000000000000000000dead',
	'critterznft': '0x6714de8aa0db267552eb5421167f5d77f0c05c6d',
}
var block = 14193046
async function get_latest_block(){
	
	var current_time = Math.floor(+new Date()/1000)
	const block_response = await fetch("https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=" + current_time + "&closest=before&apikey=AXQRW5QJJ5KW4KFAKC9UH85J9ZFDTB95KQ");
	const block_data = await block_response.json()
	if(block === block_data.result){
		block = parseInt(block) + parseInt(1)
	} else {
		block = block_data.result
	}
	
}

// test_unstake_bid()
async function test_unstake_bid(){
	get_latest_block()
	//startblock + 1 to avoid repeat
	for(var set in staking_sets){
		await new Promise(resolve => setTimeout(resolve, 500))
		var collection = await get_collection(set)
		collection = collection.collection
		
		const response = await fetch("https://api.etherscan.io/api?module=account&action=tokennfttx&contractaddress=" + collection.primary_asset_contracts[0].address + "&page=1&startblock=" + block + "&offset=100&sort=desc&apikey=AXQRW5QJJ5KW4KFAKC9UH85J9ZFDTB95KQ");
		const data = await response.json()
		console.log(data.result)
		var bid_amount = collection.stats.floor_price * (.9 - collection.dev_seller_fee_basis_points/10000)
		for(let tx of data.result){	
			if(tx.from === staking_sets[set]){
				
				bid(set, tx.tokenName, tx.tokenID, collection.primary_asset_contracts[0].address, bid_amount)
				console.log('--------------------------------------------------------')
				console.log('--------------------------------------------------------')
				console.log('--------------------------------------------------------')
				console.log('--------------------------------------------------------')
				console.log(tx.tokenName + ' ' + tx.tokenID + ' ' + collection.stats.floor_price)
				console.log('--------------------------------------------------------')
				console.log('--------------------------------------------------------')
				console.log('--------------------------------------------------------')
				console.log('--------------------------------------------------------')
			}
		}
		console.log(set + ' ' + collection.stats.floor_price + ' bid: ' + bid_amount + ' block ' + block)
	}
	
	await new Promise(resolve => setTimeout(resolve, 5000))
	test_unstake_bid()
}

async function bid(set, name, token_id, contract_address, bid_amount){
	try{
		await seaport.createBuyOrder({
			asset: {
			tokenId: token_id,
			tokenAddress: contract_address
			},
			startAmount: bid_amount,
			accountAddress: document.getElementById('unstake_bid').value,
			expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * .25),
		})
		text_area.innerHTML += "Bid: " + bid_amount + " on <a href=https://opensea.io/assets/" + contract_address + '/' + token_id + " target=_blank>" + name + "</a> " + token_id + '<br>'
	} catch(e){
		text_area.innerHTML += "ERROR: " + bid_amount + " on <a href=https://opensea.io/assets/" + contract_address + '/' + token_id + " target=_blank>" + name + "</a> " + token_id + '<br>'
		console.log(e)
	}
}
async function get_top_bid_range(a, min, max){
	try{
		const order = await seaport.api.getOrders({
			asset_contract_address: a.tokenAddress,
			token_ids: a.tokenId,
			side: 0,
			order_by: 'eth_price',
			order_direction: 'desc',
			limit: 50,
		})
		var orders = order.orders
		var top_bid = min
		for(var bid of orders){
			try{
				if(bid.makerAccount.user.username === 'DrBurry'){
				continue
				} 
			}catch(e) {
			}
			
			var curr_bid = bid.basePrice/1000000000000000000
			if(curr_bid > max){
				console.log(a.name + " High bid: " + curr_bid)
				continue
			}
			if(curr_bid > top_bid){
				top_bid = curr_bid
			}
		}
		return top_bid
	} catch(e){
		console.log(e)
	}
}
async function batch_up_bid(collection, a_list, token_address, address){
	try{
		var offset = 0
		var token_ids = []
		var min = collection.stats.floor_price * (.7 - (collection.dev_seller_fee_basis_points/10000))
		var max = collection.stats.floor_price * (.9 - (collection.dev_seller_fee_basis_points/10000))
		for(var a of a_list){
			token_ids.push(a.tokenId)
		}
		do {
			const order = await seaport.api.getOrders({
				asset_contract_address: token_address,
				token_ids: token_ids,
				side: 0,
				order_by: 'eth_price',
				order_direction: 'desc',
				limit: 50,
				offset: offset
			})
			var order_length = order.orders.length
			console.log(order.orders.length)
			console.log(order.orders)
			offset += 50
		} while(order_length === 50)
		
		// var top_bid = order.orders[0].basePrice/1000000000000000000
		// for(var bid of orders){
		// 	console.log(bid)
		// 	try{
		// 		if(bid.makerAccount.user.username === 'DrBurry' || bid.makerAccount.address === address){
		// 		continue
		// 		} 
		// 	}catch(e) {
		// 		}
		// 	var curr_bid = bid.basePrice/1000000000000000000
		// 	if(curr_bid > top_bid){
		// 		top_bid = curr_bid
		// 	}
		// }
	} catch(e){
		console.log(e)
	}

}
async function two_function_bid(){

}
document.getElementById('collection_bid').addEventListener('click', function(){	
	//slug, textarea, abs max
	collection_bid('onchainmonkey')
	collection_bid('chain-runners-nft')
})
var bids_made = 0
async function collection_bid(slug){
	var assets_data = require('./collections/' + slug + '.json')
	assets_data = assets_data.assets
	text_area.innerHTML = ""
	var collection_data = await get_collection(slug)
	collection_data = collection_data.collection
	var contract_address = collection_data.primary_asset_contracts[0].address
	var traits = data.default.COLLECTION_TRAIT[slug]
	console.log(traits)

	if('fur' in traits){
		console.log('fur found')
		console.log(traits['fur'])
	}
	// var a_list = []
	start()
	for(let a of assets_data){
		if(bids_made % 100 === 0 || bids_made === 0) {
			collection_data = await get_collection(slug)
			console.log(collection_data)
			collection_data = collection_data.collection
			contract_address = collection_data.primary_asset_contracts[0].address
		}
		if(bids_made % 10 === 0 || bids_made === 0){
			text_area.innerHTML = ""
			text_area.innerHTML += slug + " Floor: " + collection_data.stats.floor_price + " fee: " + collection_data.dev_seller_fee_basis_points/100 + "%<br>"
		}
		await new Promise(resolve => setTimeout(resolve, 250))
		var min_range = .7
		var max_range = .9

		for(let trait of a.traits){
			if(trait.trait_type in traits){

			}
		}

		var min = collection_data.stats.floor_price * (min_range - (collection_data.dev_seller_fee_basis_points/10000))
		var max = collection_data.stats.floor_price * (max_range - (collection_data.dev_seller_fee_basis_points/10000))
		var top_bid = await get_top_bid_range(a, min, max)
		var bid_amount = parseFloat(top_bid) + parseFloat(.001)
		try{
			await seaport.createBuyOrder({
				asset: {
				tokenId: a.tokenId,
				tokenAddress: a.tokenAddress
				},
				startAmount: bid_amount,
				//bot_1
				accountAddress: '0xdD549945A8dDDdCD73EB2F2D5Fe2bfce932c6A78',
				expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * 1),
			})
			text_area.innerHTML += "Bid: " + bid_amount.toFixed(3) + " on <a href=https://opensea.io/assets/" + a.tokenAddress + '/' + a.tokenId + " target=_blank>" + a.name + "</a> " + bids_made + '<br>'
		} catch(e){
			text_area.innerHTML += "ERROR: " + bid_amount.toFixed(3) + " on <a href=https://opensea.io/assets/" + a.tokenAddress + '/' + a.tokenId + " target=_blank>" + a.name + "</a> " + a.tokenId + '<br>'
			console.log(e)
		}

		// a_list.push(a)
		// if(a_list.length === 30) {
		// 	await batch_up_bid(collection_data, a_list, a.tokenAddress, '0xdD549945A8dDDdCD73EB2F2D5Fe2bfce932c6A78')
		// 	a_list = []
		// }
		bids_made += 1
	}
}

async function get_collection(slug){
	try{
		const collect = await seaport.api.get('/api/v1/collection/' + slug)
		return collect
	} catch (ex) {
		await new Promise(resolve => setTimeout(resolve, 500))
		console.log("couldn't get floor")
	} 
}
var collections = {}
async function get_nfts(){
	// var token_ids = []
	// var offset = 0
	const hidden = ['theapesonsnft', 'babydeluxe', 'doodlebearsdeluxe', 'neneneko-labs', 'larva-lads', 'pandaparadise', 
	'frosty-snowbois', "baycforpeople", 'zoogangnft', 'dirtybird-flight-club', 'ens', 'metaverse-cool-cats', 'larva-eggs', 
	'doomers', 'etherdash', 'minitaurs-reborn', 'trexmafiaog', 'bit-kongz', 'drinkbepis', 'larvadads', 'larva-doods', 'doodlefrensnft'
	, 'flower-friends', 'feelgang', 'doodlebitsnft', 'croodles', 'doodle-apes-society-das', 'doodledogsofficial', 'pixelwomennft', 'drunk-ass-dinos', 'vax-apes',
	'radioactiveapesofficial', 'blockverse-mc', 'hollydao', 'fees-wtf-nft', 'cryptoheartznft', 'chainfaces-arena', 'dopey-ducklings', 'the-pigeon-social-tps']
	for(var account in values.default.OWNER_ADDRESS){
		try {
			await new Promise(resolve => setTimeout(resolve, 500))
			const response = await fetch("https://api.etherscan.io/api?module=account&action=tokennfttx&address=" + values.default.OWNER_ADDRESS[account].address + "&startblock=0&endblock=999999999&sort=asc&apikey=" + API_KEY);
			const data = await response.json()
			console.log(data)
			console.log(data.result.length)
			for(var i in data.result){
				try {
					//token_ids.push(data.result[i].tokenID)
					const asset = await seaport.api.getAsset({
						tokenAddress: data.result[i].contractAddress,
						tokenId: data.result[i].tokenID,
					})
					if(asset.owner.address.toLowerCase() === values.default.OWNER_ADDRESS[account].address.toLowerCase() && hidden.includes(asset.collection.slug) === false){
						// if(Object.keys(collections).includes(asset.collection.slug)){
						// 	collections[asset.collection.slug].push(asset)
						// } else {
						// 	collections[asset.collection.slug] = [asset]
						// }
						if(collections[asset.collection.slug] === undefined){
							collections[asset.collection.slug] = {}
							collections[asset.collection.slug][asset.tokenId] = asset
						} else {
							if(!(asset.tokenId in collections[asset.collection.slug])){
								collections[asset.collection.slug][asset.tokenId] = asset
							}
						}
					}
				} catch(ex){
					console.log(ex)
					await new Promise(resolve => setTimeout(resolve, 5000))
				}
			}
			
		} catch (error) {
		  console.log('Looks like there was a problem: ', error);
		}
	}
	display()
}

async function display(){
	var count = 0
	var eth_value = 0
	var divNode = document.getElementById('page')
	divNode.innerHTML = ''
	for(const collection in collections){
		try{
			await new Promise(resolve => setTimeout(resolve, 500))
			const collect = await seaport.api.get('/api/v1/collection/' + collection)
			console.log(collect)
			var floor_price = collect['collection']['stats']['floor_price']
			var nodeh3 = document.createElement('h3')
			nodeh3.innerHTML = '<a target=_blank href="https://opensea.io/collection/' + collection + '">' + collection + '</a> FLOOR: ' + floor_price.toFixed(4) + ' ' + collect['collection']['dev_seller_fee_basis_points']/100 + '% One day sales: ' + collect.collection.stats.one_day_sales + ' | average price: ' + collect.collection.stats.one_day_average_price.toFixed(4) + ' '
			nodeh3.style = 'text-align: center'
			divNode.appendChild(nodeh3)
			let hide_button = document.createElement('button')
			hide_button.id = collection + ' button' 
			hide_button.innerHTML = 'Hide'
			hide_button.addEventListener('click', function(){
				if(document.getElementById(this.id.split(' ')[0]).style.display === 'none'){
					document.getElementById(this.id.split(' ')[0]).style.display = ''
					hide_button.innerHTML = 'Hide'
				} else{
					document.getElementById(this.id.split(' ')[0]).style.display = 'none'
					hide_button.innerHTML = 'Show'
				}
			})
			divNode.appendChild(hide_button)
			var nodeflexcontainer = document.createElement('div')
			nodeflexcontainer.className = 'flex-container'
			nodeflexcontainer.id = collection
			for(var asset in collections[collection]){
				eth_value += floor_price
				asset = collections[collection][asset]
				count += 1
				console.log(asset)

				var nodediv = document.createElement('div')
				nodediv.className = 'flex-item'
				var nodedivtxt = document.createElement('div')
				var nodeimg = document.createElement('img')

				nodeimg.style.width = '150px'
				nodeimg.style.height = '150px'
				nodeimg.src = asset.imageUrl
				try {
					var top_bid = asset.buyOrder[0].basePrice/1000000000000000000
				} catch (e){
					top_bid = 0
				}
				
				var curr_bid = 0

				for(var bid in asset.buyOrders){
	              try{
	              	console.log('buy order')
	              	console.log(asset.buyOrders[bid])
	                if(asset.buyOrders[bid].makerAccount.user.username === 'DrBurry' || asset.buyOrders[bid].paymentTokenContract.symbol !== 'WETH'){
	                  continue
	                } 
	              }catch(e) {
	                }
	              curr_bid = asset.buyOrders[bid].basePrice/1000000000000000000
	              if(curr_bid > top_bid){
	                top_bid = curr_bid
	              }        
	            }
	            try{
	            	var listed_price = asset.sellOrders[0].basePrice/1000000000000000000
	            }catch(e){
	            	listed_price = '--'
	            	nodediv.style.backgroundcolor = '#e69138'
	            }
	            try{
	            	var last_sale = ' (' + (asset.lastSale.totalPrice/1000000000000000000).toFixed(3) + ')'
	            } catch(e){
	            	last_sale = ' (--)'
	            }
				//asset.owner.address
	            var username = asset.owner.user.username
				nodedivtxt.innerHTML = username + '<br><a target=_blank href=' + asset.openseaLink +'>#' + asset.tokenId + '</a><br>' + listed_price + last_sale + '<br><span style="color:purple">' + top_bid.toFixed(3) + '<br></span>'
				var input = document.createElement('input')

				//Button to list
				var button = document.createElement('button')
				button.id = asset.collection.slug + ' ' + asset.tokenId + ' ' + asset.tokenAddress
				input.id = asset.collection.slug + '' + asset.tokenId
				button.addEventListener('click', function(){	
					sell_order(this.id.split(' '))
				})
				button.innerHTML = '>'

				//Button to transfer
				var transfer_button = document.createElement('button')
				transfer_button.id = asset.collection.slug + ' ' + asset.tokenId + ' ' + asset.tokenAddress + ' ' + asset.owner.address
				input.id = asset.collection.slug + '' + asset.tokenId
				transfer_button.addEventListener('click', function(){	
					get_gas()
					var confirm_transfer = window.confirm('Confirm Transfer.')
					if(confirm_transfer === true){
						console.log('transfer complete')
						console.log(this.id.split(' '))
						transfer(this.id.split(' '))
					} else {
						console.log('No')
					}
					//sell_order(this.id.split(' '))
				})
				transfer_button.innerHTML = 'X'

				input.style.width = '50px'
				nodedivtxt.appendChild(input)
				nodedivtxt.appendChild(button)
				nodedivtxt.appendChild(transfer_button)
				nodediv.appendChild(nodeimg)
				nodediv.appendChild(nodedivtxt)

				nodeflexcontainer.appendChild(nodediv)
			}
			divNode.appendChild(nodeflexcontainer)
		} catch (e) {
			console.log(e)
		}
	}
	console.log(eth_value)
	console.log(count)
	document.getElementById('account').innerHTML = 'Total ' + balance.toFixed(4) + ' ETH ' + weth_balance.toFixed(4) + ' WETH NFTs: ' + count + ' Value(Based on Floor): ' + eth_value
	
}
// document.getElementById('refresh').addEventListener('click', display)
// document.getElementById('search').addEventListener('input', search)

function search(){
	console.log(document.getElementById('search').value)
	if(Object.keys(collections).includes(document.getElementById('search').value)){
		document.getElementById(document.getElementById('search').value).scrollIntoView();
	} 
}

async function sell_order(item){
	console.log(document.getElementById(item[0]+item[1]).value)
	console.log(item)
	if(document.getElementById(item[0]+item[1]).value !== ''){
		try{
			const auction = await seaport.createSellOrder({
				asset: {
					tokenAddress: item[2], // CryptoKitties
					tokenId: item[1], // Token ID
			    },
				accountAddress: ADDRESS,
				startAmount: document.getElementById(item[0]+item[1]).value,
			})
			console.log(auction)
		} catch(e) {
		console.log(e)
		}
	} else {
		alert('No')
	}	
}
async function transfer(item){
	swap()
	const transactionHash = await seaport.transfer({
		asset: {
			tokenAddress: item[2], // CryptoKitties
			tokenId: item[1], // Token ID
	    },
		fromAddress: item[3], // Must own the asset
		toAddress:  ADDRESS
	})
	console.log(transactionHash)
	swap()
}
var bidding_wallets = ['0x35C25Ff925A61399a3B69e8C95C9487A1d82E7DF', '0x1AEc9C6912D7Da7a35803f362db5ad38207D4b4A', '0x18a73AaEe970AF9A797D944A7B982502E1e71556', '0x4d64bDb86C7B50D8B2935ab399511bA9433A3628']
async function get_top_bid_range_redis(a, min, max){
	try{
		const order = await seaport.api.getOrders({
			asset_contract_address: a.token_address,
			token_ids: a.token_id,
			side: 0,
			order_by: 'eth_price',
			order_direction: 'desc',
			limit: 50,
		})
		var orders = order.orders
		var top_bid = min
		for(var bid of orders){
			try{
				if(bidding_wallets.includes(bid.makerAccount.address)){
					return 'skip'
				} 
			}catch(e) {
			}
			
			var curr_bid = bid.basePrice/1000000000000000000
			if(curr_bid > max){
				return curr_bid
			}
			if(curr_bid > top_bid){
				top_bid = curr_bid
			}
		}
		return top_bid
	} catch(e){
		console.log(e)
	}
}
async function sleep(ms){
	await new Promise(resolve => setTimeout(resolve, ms))
}
function get_ISOString(seconds){
	let search_time = Math.floor(+new Date()) - seconds
	return new Date(search_time).toISOString();
}
function get_ISOString_now(){
	let search_time = Math.floor(+new Date())
	return new Date(search_time).toISOString();
}

var wallet_set = data.default.WATCH_LIST
var wallet_orders = data.default.COMP_WALLETS
var event_window = 60000

document.getElementById('delay').value = 0

async function get_redis_bids(){
	if(values.default.ALCHEMY_KEY === undefined && bids_made % 1000 === 0){
		create_seaport()
	}
	try{
		var redis_bids = await fetch('http://10.0.0.199:3000/test_call') 
	  redis_bids = await redis_bids.json() 
	  for(let asset of redis_bids){
	  	await sleep(document.getElementById('delay').value)
	  	await competitor_bid(asset)
  		console.log(asset)
  	}
  get_redis_bids()

} catch(e){
	console.log(e)
}
  
}
// if error call await get_collection(slug) .stats.floor_price
async function get_redis_floor(slug){
	try{
		var floor = await fetch('http://10.0.0.199:3000/floor?name=' + slug) 
	  return parseFloat(await floor.text())
} catch(e){
	console.log(e)
	document.getElementById('body').style.background = 'lightyellow'
	await sleep(6000)
	document.getElementById('body').style.background = 'lightgray'
	return get_redis_floor(slug)

}
	// try{
	// 	var collection = await get_collection(slug)
	// 	console.log(collection)
	// 	return collection.collection.stats.floor_price
	// } catch (e){
	// 	console.log(e)
	// }
	
}
// testcall()
var account_weth = 0
var account_weth_temp = 0
var first = 1
async function get_account_weth(){
	account_weth = await get_weth_balance(ADDRESS)
	if(account_weth_temp !== account_weth && first !== 1){
		document.getElementById('account_name').style.color = 'red'
	}
	first = 0
	account_weth_temp = account_weth
	try{
		document.getElementById('account_weth').innerHTML = 'WETH: ' + account_weth.toFixed(2)
		document.getElementById('account_weth').style.color = 'red'
	} catch(e){
		await sleep(6000)
		return get_account_weth()
	}
	
}
var current_time = 0
document.getElementById('competitor_bid22').addEventListener('click', function(){	
	current_time = Math.floor(+new Date()/1000)
	ADDRESS = '0x35C25Ff925A61399a3B69e8C95C9487A1d82E7DF'
	get_account_weth()
	document.getElementById('account_name').innerHTML = 'DustBunny_22(82E7DF) '
	reset()
	start()
	get_redis_bids()
	get_redis_bids()
})
document.getElementById('competitor_bid20').addEventListener('click', function(){	
	current_time = Math.floor(+new Date()/1000)
	ADDRESS = '0x18a73AaEe970AF9A797D944A7B982502E1e71556'
	get_account_weth()
	document.getElementById('account_name').innerHTML = 'DustBunny_20(E71556) '
	reset()
	start()
	get_redis_bids()
	get_redis_bids()
})
document.getElementById('competitor_bid19').addEventListener('click', function(){	
	current_time = Math.floor(+new Date()/1000)
	ADDRESS = '0x4d64bDb86C7B50D8B2935ab399511bA9433A3628'
	get_account_weth()
	document.getElementById('account_name').innerHTML = 'DustBunny_19(3A3628) '
	reset()
	start()
	get_redis_bids()
	get_redis_bids()
})

var bid_total_value = 0
var bpm = 0
var runtime = 0
var good_set = ['cool-cats-nft', 'mutant-ape-yacht-club', 'bored-ape-kennel-club', 'azuki', 'nft-worlds', 'clonex', 'doodles-official', 'cyberkongz']
async function competitor_bid(asset){
	var slug = asset.slug
	var fee = asset.fee
	var floor = await get_redis_floor(asset.slug)
	console.log(floor)
	if(bids_made % 20 === 0 && bids_made !== 0){
		text_area.innerHTML = ""
		get_gas()
	}
	if(bids_made % 100 === 0 && bids_made !== 0){
		runtime = Math.floor(+new Date()/1000) - current_time
		bpm = bids_made/(runtime/60)
		get_account_weth()
	}
	var min_range = .6
	var max_range = .85
	var exp_time = .33
	if(good_set.includes(asset.slug)){
		max_range = .9
	}
	var min = floor * (min_range - fee)
	var max = floor * (max_range - fee)
	var top_bid = await get_top_bid_range_redis(asset, min, max)

	var bid_amount = parseFloat(top_bid) + parseFloat(.001)
	if(top_bid === 'skip'){
		text_area.innerHTML += "Floor: " + floor.toFixed(2) + "ALREADY TOP BID, Max: " + max.toFixed(3) + " on <a href=https://opensea.io/assets/" + asset.token_address + '/' + asset.token_id + " target=_blank>" + asset.slug + ' ' + asset.token_id + "</a><br>"
		return
	}
	if(top_bid > max){
		text_area.innerHTML += "Floor: " + floor.toFixed(2) + " TOO HIGH: " + bid_amount.toFixed(3) + 'Max: ' + max.toFixed(3) + " on <a href=https://opensea.io/assets/" + asset.token_address + '/' + asset.token_id + " target=_blank>" + asset.slug + ' ' + asset.token_id + "</a><br>"
		return 
	}
	if(top_bid < account_weth)
	try{
		var assets_data = {
    	tokenId: asset.token_id,
      tokenAddress: asset.token_address,
    }
    if (asset.slug === 'guttercatgang' || asset.slug === 'clonex-mintvial'){
      assets_data = {
        tokenId: asset.token_id,
        tokenAddress: asset.token_address,
        schemaName: WyvernSchemaName.ERC1155
      }      
    }
		await seaport.createBuyOrder({
			asset: assets_data,
			startAmount: bid_amount,
			accountAddress: ADDRESS,
			expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * exp_time),
		})
		bids_made += 1
		bid_total_value += bid_amount
		document.getElementById('stats').innerHTML = "Bids: " + bids_made  + ' | BPM: ' + bpm.toFixed() + " | Bid Total Value: " + bid_total_value.toFixed(2) + ' | Avg bid: ' + (bid_total_value/bids_made).toFixed(2) 
		text_area.innerHTML += "Floor: " + floor.toFixed(2) + " Bid: " + bid_amount.toFixed(3) + " on <a href=https://opensea.io/assets/" + asset.token_address + '/' + asset.token_id + " target=_blank>" + asset.slug + ' ' + asset.token_id + "</a>" + ' Exp: ' + (60 * exp_time).toFixed(0) + ' min' + "<br>"
	} catch(e){
		text_area.innerHTML += "Floor: " + floor.toFixed(2) + " ERROR: " + bid_amount.toFixed(3) + " on <a href=https://opensea.io/assets/" + asset.token_address + '/' + asset.token_id + " target=_blank>" + asset.slug + "</a> " + asset.token_id + '<br>'
		console.log(e)
		document.getElementById('body').style.background = 'pink'
		await sleep(60000)
		document.getElementById('body').style.background = 'lightgray'
	}
}
function create_seaport(){
  providerEngine.stop();
  currentHour = new Date().getHours()
  INFURA_KEY = values.default.INFURA_KEY[Math.floor(currentHour/3)] //[parseInt(run_count)%parseInt(values.default.INFURA_KEY.length - 1)]
  if(values.default.INFURA_KEY.length === 6){
    INFURA_KEY = values.default.INFURA_KEY[Math.floor(currentHour/4)]
  } else if(values.default.INFURA_KEY.length === 4){
    INFURA_KEY = values.default.INFURA_KEY[Math.floor(currentHour/6)]
  }else if(values.default.INFURA_KEY.length === 5){
  INFURA_KEY = values.default.INFURA_KEY[Math.floor(currentHour/5)]
}
  console.log('creating seaport ' + INFURA_KEY)
  infuraRpcSubprovider = new RPCSubprovider({
    rpcUrl: "https://mainnet.infura.io/v3/" + INFURA_KEY
  });
  providerEngine = new Web3ProviderEngine();
  const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
	  mnemonic: MNEMONIC,
	});
  providerEngine.addProvider(mnemonicWalletSubprovider);
  providerEngine.addProvider(infuraRpcSubprovider);
  providerEngine.start();
  seaport = new OpenSeaPort(
    providerEngine,
    {
      networkName: Network.Main,
      apiKey: values.default.API_KEY
    },
    (arg) => console.log(arg)
  );
}
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
  document.getElementById("time").innerHTML = txt;
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