const values = require('./values.js')
// const data = require('./data.js')
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

// values.default.OWNER_ADDRESS = data.default.OWNER_ADDRESS

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

var acct_dict = {}
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
			return_val += "<a href=https://opensea.io/collection/" + c + " target=_blank>" + c + "</a><br>"
		}
		return return_val//order.orders[0].asset.collection.slug
	} else {
		return false
	}
  }
  catch(ex) {
	console.log(ex.message)
  }
	console.log('Complete') 
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
	var table1 = document.getElementById('table1-body')
	var table2 = document.getElementById('table2-body')
	var table3 = document.getElementById('table3-body')

	
	for(var account of values.default.OWNER_ADDRESS){
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
			tr = document.createElement("tr");
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

})

var bids_made = 0
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
						// includeOrders: true,
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
				try{
					console.log('sell order -- ')
					console.log(asset)
					console.log(asset.sellOrders[0])
					var listed_price = asset.sellOrders[0].basePrice/1000000000000000000
				}catch(e){
					listed_price = '--'
					nodediv.style.backgroundcolor = '#e69138'
				}
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
				button.id = asset.collection.slug + ' ' + asset.tokenId + ' ' + asset.tokenAddress + ' ' + asset.owner.address + ' extra'
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
				accountAddress: item[3],
				startAmount: document.getElementById(item[0]+item[1]).value,
				expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * 72),
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
	const transactionHash = await seaport.transfer({
		asset: {
			tokenAddress: item[2], // CryptoKitties
			tokenId: item[1], // Token ID
	    },
		fromAddress: item[3], // Must own the asset
		toAddress:  ADDRESS
	})
	console.log(transactionHash)
}
var bidding_wallets = ['0x35C25Ff925A61399a3B69e8C95C9487A1d82E7DF', '0x18a73AaEe970AF9A797D944A7B982502E1e71556']
var wallet_names = ['DustBunny_22','DustBunny_20']
for(let w in bidding_wallets){
	bidding_wallets[w] = bidding_wallets[w].toLowerCase()
}
let random_start = getRandomInt(bidding_wallets.length)
start_bids(bidding_wallets[random_start], wallet_names[random_start])
async function get_top_bid_range_redis(a, min, max){
	try{
		await sleep(100)
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
		var first = true
		for(var bid of orders){
			try{
				if(bidding_wallets.includes(bid.makerAccount.address.toLowerCase()) && first === true && ((bid.expirationTime - (Math.floor(+new Date())/1000)) > 180)){
					return 'skip'
				} else {
					first = false
				}
			}catch(e) {
			}
			if(bid.paymentTokenContract.symbol !== 'WETH'){
				continue
			}
			var curr_bid = bid.basePrice/1000000000000000000
			// if(curr_bid > max){
			// 	continue
			// }
			if(curr_bid > top_bid){
				top_bid = curr_bid
			}
		}
		return top_bid
	} catch(e){
			console.log('Get orders failed.')
			console.log(a)
			console.log(e.message)
			document.getElementById('body').style.background = 'orange'
			await sleep(6000)
			return get_top_bid_range_redis(a, min, max)
	}
}
async function sleep(ms){
	await new Promise(resolve => setTimeout(resolve, ms))
}
var stop_run = 0
document.getElementById('stop_run').addEventListener('click', function(){	
	stop_run = 1
	reset()
	document.getElementById('body').style.background = 'lightgray'
	text_area.innerHTML = ""
	document.getElementById('stats').innerHTML = 'stats'
})
document.getElementById('delay').value = 0
async function get_redis_bids(){
	if(stop_run === 1){
		return
	}
	if(values.default.ALCHEMY_KEY === undefined && bids_made % 1000 === 0 && bids_made !== 0){
		create_seaport()
	}
	try{
		let redis_bids = await fetch('http://10.0.0.59:3000/redis_queue_pop') 
	  redis_bids = await redis_bids.json() 
	  for(let asset of redis_bids){
	  	await sleep(document.getElementById('delay').value)
	  	await competitor_bid(asset)
  	}
  get_redis_bids()

	} catch(e){
		console.log(e.message)
		document.getElementById('body').style.background = 'lightsalmon'
		await sleep(3000)
		return get_redis_bids()
	}
}
async function get_redis_bids2(){
	if(stop_run === 1){
		return
	}
	if(values.default.ALCHEMY_KEY === undefined && bids_made % 1000 === 0 && bids_made !== 0){
		create_seaport()
	}
	try{
		let redis_bids = await fetch('http://10.0.0.59:3000/redis_queue_pop') 
	  redis_bids = await redis_bids.json() 
	  for(let asset of redis_bids){
	  	await sleep(document.getElementById('delay').value)
	  	await competitor_bid2(asset)
  	}
  get_redis_bids2()

	} catch(e){
		console.log(e.message)
		document.getElementById('body').style.background = 'lightsalmon'
		await sleep(3000)
		return get_redis_bids2()
	}
}
async function get_collection(slug){
  try{
    const collect = await seaport.api.get('/api/v1/collection/' + slug)
    return collect
  } catch (ex) {
    console.log("couldn't get collection")
  }  
}
// if error call await get_collection(slug) .stats.floor_price
async function get_redis_floor(slug){
	try{
		let floor = await fetch('http://10.0.0.59:3000/collectionstats?name=' + slug) 
		var data = await floor.json()
	  return data
	} catch(e){
		console.log(e.message)
		document.getElementById('body').style.background = 'lightsalmon'
		await sleep(3000)
		try{
			console.log('Using OpenSea api to get floor for ' + slug + '...')
			let collection = await get_collection(slug)
			document.getElementById('body').style.background = 'lightgreen'
			collection.collection.stats['dev_seller_fee_basis_points'] = collection.collection.dev_seller_fee_basis_points
			return collection.collection.stats
		} catch(e){
			await sleep(3000)
			console.log('retrying...')
			get_redis_floor(slug)
		}
		
	}
}
// async function get_redis_length(){
// 	try{
// 		var length = await fetch('http://10.0.0.59:3000/length') 
// 	  return parseFloat(await length.text())
// 	} catch(e){
// 		console.log(e.message)
// 		document.getElementById('body').style.background = 'lightsalmon'
// 		await sleep(6000)
// 		document.getElementById('body').style.background = 'lightgreen'
// 		return get_redis_length()
// 	}
// }
// testcall()
var account_weth = 0
var account_weth_temp = 0
var first = 1
async function print_weth_balances(){
	let total_weth = 0
	document.getElementById('display_balances').innerHTML = ''
	for(let index in bidding_wallets){
		let weth = await get_weth_balance(bidding_wallets[index])
		total_weth += weth
		document.getElementById('display_balances').innerHTML +=wallet_names[index] + ' :<font color=red>' + weth.toFixed(2) + '</font> | '
	}
	// document.getElementById('display_balances').innerHTML +='DustBunny_19 :<font color=red>' + (await get_weth_balance('0x4d64bDb86C7B50D8B2935ab399511bA9433A3628')).toFixed(2) + '</font> | '
	// document.getElementById('display_balances').innerHTML +='DustBunny_20 :<font color=red>' + (await get_weth_balance('0x18a73AaEe970AF9A797D944A7B982502E1e71556')).toFixed(2) + '</font> | '
	// document.getElementById('display_balances').innerHTML +='DustBunny_21: <font color=red>' + (await get_weth_balance('0x1AEc9C6912D7Da7a35803f362db5ad38207D4b4A')).toFixed(2) + '</font> | '
	// document.getElementById('display_balances').innerHTML +='DustBunny_22: <font color=red>' + (await get_weth_balance('0x35C25Ff925A61399a3B69e8C95C9487A1d82E7DF')).toFixed(2) + '</font>'
	document.getElementById('display_balances').innerHTML +='Total: <font color=red>' + total_weth.toFixed(2) + '</font>'
}
print_weth_balances()
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
//values.default.
var current_time = Math.floor(+new Date()/1000)
var current_time_hour = Math.floor(+new Date()/1000)
async function start_bids(address, user_data){
	document.getElementById('body').style.background = 'lightgreen'
	ADDRESS = address
	get_account_weth()
	document.getElementById('account_name').innerHTML = user_data + ' ' + values.default.API_KEY
	await sleep(1000)
	reset()
	start()
	get_redis_bids()
	get_redis_bids2()
	
}
// if(values.default.START_ACCOUNT !== undefined){
// 	let display_account = values.default.START_ACCOUNT.address
// 	let display_name = values.default.START_ACCOUNT.username + '(' + display_account.substring((display_account.length - 6)) + ')'
// 	start_bids(values.default.START_ACCOUNT.address, display_name)
// }
function account_change(a, n){
	console.log('Changing accounts')
	ADDRESS = a
	let display_username  = n
	let display_name = display_username + '(' + ADDRESS.substring((ADDRESS.length - 6)).toUpperCase() + ')'
	document.getElementById('account_name').innerHTML = display_name + ' ' + values.default.API_KEY
}
document.getElementById('account1').innerHTML = wallet_names[0] + '(' + bidding_wallets[0].substring((ADDRESS.length - 6)).toUpperCase() + ')'
document.getElementById('account2').innerHTML = wallet_names[1] + '(' + bidding_wallets[1].substring((ADDRESS.length - 6)).toUpperCase() + ')'
// document.getElementById('account3').innerHTML = wallet_names[2] + '(' + bidding_wallets[2].substring((ADDRESS.length - 6)).toUpperCase() + ')'
// document.getElementById('account4').innerHTML = wallet_names[3] + '(' + bidding_wallets[3].substring((ADDRESS.length - 6)).toUpperCase() + ')'

document.getElementById('account1').addEventListener('click', function(){	
	account_change(bidding_wallets[0], wallet_names[0])
})
document.getElementById('account2').addEventListener('click', function(){	
	account_change(bidding_wallets[1], wallet_names[1])
})
document.getElementById('account3').addEventListener('click', function(){	
	account_change(bidding_wallets[2], wallet_names[2])
})
document.getElementById('account4').addEventListener('click', function(){	
	account_change(bidding_wallets[3], wallet_names[3])
})

var bid_total_value = 0
var bpm = 0
var bpm_hour = 0
var runtime = 0
var runtime_hour = 0
var bids_made_hour = 0
var queue_length = 0
var calls = 0
var skip_list = []
async function competitor_bid(asset){
	if(skip_list.includes(asset.slug + asset.token_id)){
		return
	}
	let collection_data = await get_redis_floor(asset.slug)
	let floor = collection_data.floor_price
	let fee = collection_data.dev_seller_fee_basis_points/10000
	calls += 1
	if((calls > 9) && bids_made !== 0){
		if(calls % 15000 === 0){
			skip_list = []
		}
		calls = 0
		// queue_length = await get_redis_length()
		text_area.innerHTML = ""
		runtime = Math.floor(+new Date()/1000) - current_time
		runtime_hour = Math.floor(+new Date()/1000) - current_time_hour
		bpm = bids_made/(runtime/60)
		bpm_hour = bids_made_hour/(runtime_hour/60)
		if(runtime_hour > 3600) {
			bids_made_hour = 0
			current_time_hour = Math.floor(+new Date()/1000)
		}
		// get_gas()
	}
	// if(bids_made % 100 === 0 && bids_made !== 0){
	// 	get_account_weth()
	// }
	let trait = ''
	let min_range = .61
	let max_range = .81
	let exp_time = .25
	if(asset['tier']){
		if(asset['tier'] === 'medium'){
			min_range = .66
			max_range = .86
		} else if(asset['tier'] === 'high'){
			min_range = .71
			max_range = .91
		} else if(asset['tier'] === 'medium-low'){
			min_range = .685
			max_range = .835
		}
	}
	if(asset['bid_range']){
		min_range = asset['bid_range'][0]
		max_range = asset['bid_range'][1]
	}
	let min = floor * (min_range - fee)
	let max = floor * (max_range - fee)
	let top_bid = min
	if(asset['expiration']){
		exp_time = asset['expiration']
	}
	if(asset['trait']){
		trait = asset['trait']
	}
	if(asset['bid_amount']){
		top_bid = asset['bid_amount']
	} else {
		top_bid = await get_top_bid_range_redis(asset, min, max)
	} 
	let bid_amount = parseFloat(top_bid) * 1.01
	if(bid_amount > max){
		bid_amount = max
	}
	try{
		if(top_bid === 'skip'){
			text_area.innerHTML += "<font color=brown>Flr: " + floor.toFixed(2) + " ALREADY TOP, Max: " + max.toFixed(3) + ", " + trait + " <a href=https://opensea.io/assets/" + asset.token_address + '/' + asset.token_id + " target=_blank>" + asset.slug + ' ' + asset.token_id + "</a> type: " + asset.event_type + "</font><br>"
			await sleep(1000)
			return
		}
		if(top_bid > max && !asset['bypass_max']){
			text_area.innerHTML += "<font color=purple>Flr: " + floor.toFixed(2) + " TOO HIGH: "+ " Fee: " + (fee*100).toFixed(1) + "% Bid: " + top_bid.toFixed(3) + ", " + trait + ' ' + (bid_amount/floor).toFixed(2) + ' ' + min_range + '-' + max_range + ' Max: ' + max.toFixed(3) + ", " + trait + ' Profit: ' + (floor*(1-(fee+.025)) - bid_amount).toFixed(3) + " <a href=https://opensea.io/assets/" + asset.token_address + '/' + asset.token_id + " target=_blank>" + asset.slug + ' ' + asset.token_id + "</a> type: " + asset.event_type + '</font><br>'
			await sleep(1000)
			return 
		} 
	} catch(e){
		console.log(e)
		console.log(asset['slug'])
		console.log(floor)
		console.log(max)
		console.log(top_bid)
		console.log(bid_amount)
		console.log(fee)
		console.log('errrrrrorrrr')
	}
	
	try{
		let assets_data = {
			tokenId: asset.token_id,
			tokenAddress: asset.token_address,
    	}
		if (asset.slug === 'guttercatgang' || asset.slug === 'clonex-mintvial' || asset.slug === 'gutterrats'){
			assets_data = {
				tokenId: asset.token_id,
				tokenAddress: asset.token_address,
				schemaName: WyvernSchemaName.ERC1155
			}      
		}
		// let account_index = 0
		// if(bids_made % 2 === 0){
		// 	account_index = 1
		// }
		let bidding_address = bidding_wallets[0]
		if(asset['bidding_adress']){
			bidding_address = asset['bidding_adress']
		}
		await seaport.createBuyOrder({
			asset: assets_data,
			startAmount: bid_amount,
			accountAddress: bidding_address,
			expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * exp_time),
		})
		bids_made += 1
		bids_made_hour += 1
		bid_total_value += bid_amount
		
		document.getElementById('stats').innerHTML = "Bids: " + bids_made  + ' | BPM: ' + bpm.toFixed() + " | BPM_H: " + bpm_hour.toFixed() + " | Bid Total Value: " + bid_total_value.toFixed(2) + ' | Avg bid: ' + (bid_total_value/bids_made).toFixed(2) + ' | Queue size: ' + queue_length
		text_area.innerHTML += "Fl: " + floor.toFixed(2) + " " + (fee*100).toFixed(1) + "% Bid: " + bid_amount.toFixed(3) + ", " + trait + ' ' + (bid_amount/floor).toFixed(2) + ' ' + min_range + '-' + max_range + ' Max: ' + max.toFixed(3) + ' Profit: ' + (floor*(1-(fee+.025)) - bid_amount).toFixed(3) + " <a href=https://opensea.io/assets/" + asset.token_address + '/' + asset.token_id + " target=_blank>" + asset.slug + ' ' + asset.token_id + "</a> " + (60 * exp_time).toFixed(0) + ' min | ' + asset.event_type + "<br>"
		document.getElementById('body').style.background = 'lightgreen'
	} catch(e){
		text_area.innerHTML += "<font color=red>Flr: " + floor.toFixed(2) + " ERROR: " + bid_amount.toFixed(3) + ", " + trait + " <a href=https://opensea.io/assets/" + asset.token_address + '/' + asset.token_id + " target=_blank>" + asset.slug + "</a> " + asset.token_id + ' type: ' + asset.event_type + '</font><br>'
		console.log(e.message)
		document.getElementById('body').style.background = 'pink'
		let msg = check_errors(e.message, asset)
		if(msg === 0){
			console.log('an error has occured---')
			console.log(e.message)
			await sleep(60000)
		} else if (msg === 1){
			document.getElementById('body').style.background = 'yellow'
			console.log('1')
			await sleep(15000)
			return competitor_bid(asset)
		}
		await sleep(1000)
	}
}
async function competitor_bid2(asset){
	if(skip_list.includes(asset.slug + asset.token_id)){
		return
	}
	let trait = ''
	let collection_data = await get_redis_floor(asset.slug)
	let floor = collection_data.floor_price
	let fee = collection_data.dev_seller_fee_basis_points/10000
	let min_range = .61
	let max_range = .81
	let exp_time = .25
	if(asset['tier']){
		if(asset['tier'] === 'medium'){
			min_range = .66
			max_range = .86
		} else if(asset['tier'] === 'high'){
			min_range = .71
			max_range = .91
		} else if(asset['tier'] === 'medium-low'){
			min_range = .685
			max_range = .835
		}
	}
	if(asset['bid_range']){
		min_range = asset['bid_range'][0]
		max_range = asset['bid_range'][1]
	}
	let min = floor * (min_range - fee)
	let max = floor * (max_range - fee)
	let top_bid = min
	if(asset['expiration']){
		exp_time = asset['expiration']
	}
	if(asset['trait']){
		trait = asset['trait']
	}
	if(asset['bid_amount']){
		top_bid = asset['bid_amount']
	} else {
		top_bid = await get_top_bid_range_redis(asset, min, max)
	}

	let bid_amount = parseFloat(top_bid) * 1.01
	if(bid_amount > max){
		bid_amount = max
	}
	if(top_bid === 'skip'){
		text_area.innerHTML += "<font color=brown>Flr: " + floor.toFixed(2) + " ALREADY TOP, Max: " + max.toFixed(3) + ", " + trait + " <a href=https://opensea.io/assets/" + asset.token_address + '/' + asset.token_id + " target=_blank>" + asset.slug + ' ' + asset.token_id + "</a> type: " + asset.event_type + "</font><br>"
		await sleep(1000)
		return
	}
	if(top_bid > max && !asset['bypass_max']){
		text_area.innerHTML += "<font color=purple>Flr: " + floor.toFixed(2) + " TOO HIGH: " + " Fee: " + (fee*100).toFixed(1) + "% Bid: " + top_bid.toFixed(3) + ", " + trait + ' ' + (bid_amount/floor).toFixed(2) + ' ' + min_range + '-' + max_range + ' Max: ' + max.toFixed(3) + ", " + trait + ' Profit: ' + (floor*(1-(fee+.025)) - bid_amount).toFixed(3) + " <a href=https://opensea.io/assets/" + asset.token_address + '/' + asset.token_id + " target=_blank>" + asset.slug + ' ' + asset.token_id + "</a> type: " + asset.event_type + '</font><br>'
		await sleep(1000)
		return 
	}
	try{
		let assets_data = {
			tokenId: asset.token_id,
			tokenAddress: asset.token_address,
    	}
		if (asset.slug === 'guttercatgang' || asset.slug === 'clonex-mintvial' || asset.slug === 'gutterrats'){
			assets_data = {
				tokenId: asset.token_id,
				tokenAddress: asset.token_address,
				schemaName: WyvernSchemaName.ERC1155
			}      
		}
		// let account_index = 0
		// if(bids_made % 2 === 0){
		// 	account_index = 1
		// }
		let bidding_address = bidding_wallets[1]
		if(bid_amount > 40){
			bidding_address = bidding_wallets[0]
		}
		if(asset['bidding_adress']){
			bidding_address = asset['bidding_adress']
		}
		await seaport.createBuyOrder({
			asset: assets_data,
			startAmount: bid_amount,
			accountAddress: bidding_address,
			expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * exp_time),
		})
		bids_made += 1
		bids_made_hour += 1
		bid_total_value += bid_amount
		
		text_area.innerHTML += "Fl: " + floor.toFixed(2) + " " + (fee*100).toFixed(1) + "% Bid: " + bid_amount.toFixed(3) + ", " + trait + ' ' + (bid_amount/floor).toFixed(2) + ' ' + min_range + '-' + max_range + ' Max: ' + max.toFixed(3) + ' Profit: ' + (floor*(1-(fee+.025)) - bid_amount).toFixed(3) + " <a href=https://opensea.io/assets/" + asset.token_address + '/' + asset.token_id + " target=_blank>" + asset.slug + ' ' + asset.token_id + "</a> " + (60 * exp_time).toFixed(0) + ' min | ' + asset.event_type + "<br>"
		document.getElementById('body').style.background = 'lightgreen'
	} catch(e){
		text_area.innerHTML += "<font color=red>Flr: " + floor.toFixed(2) + " ERROR: " + bid_amount.toFixed(3) + ", " + trait + " <a href=https://opensea.io/assets/" + asset.token_address + '/' + asset.token_id + " target=_blank>" + asset.slug + "</a> " + asset.token_id + ' type: ' + asset.event_type + '</font><br>'
		console.log(e.message)
		document.getElementById('body').style.background = 'pink'
		let msg = check_errors(e.message, asset)
		if(msg === 0){
			console.log('an error has occured---')
			console.log(e.message)
			await sleep(60000)
		} else if (msg === 1){
			document.getElementById('body').style.background = 'yellow'
			console.log('2 ' + asset['slug'])
			await sleep(15000)
			return competitor_bid(asset)
		}
		await sleep(1000)
	}
}
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
function check_errors(msg, asset){
  if(msg.includes('Insufficient balance.')){
    return 'Insufficient balance. Please wrap more ETH.'
    //alert('Insufficient balance. Please wrap more ETH.')
  }
  else if(msg.includes('Invalid JSON RPC response')){
		skip_list.push(asset.slug + asset.token_id)
		console.log(skip_list)
    return 'Invalid JSON RPC response'
  }
  else if(msg.includes('to fetch')){
    return 'Invalid JSON RPC response'
  }
  else if(msg.includes('API Error 400: Order already exists')){
		skip_list.push(asset.slug + asset.token_id)
		console.log(skip_list)
    return 'Error: API Error 400: Order already exists'
  }
  else if(msg.includes('This order does not have a valid bid price for the auction')){
		skip_list.push(asset.slug + asset.token_id)
		console.log(skip_list)
    return 'Auction'
  }
  else if(msg.includes('API Error 404: Not found.')){
    return 'Asset not found.'
  } else if(msg.includes('Trading is not enabled for')){
		skip_list.push(asset.slug + asset.token_id)
		console.log(skip_list)
    return 'Trading not enabled on asset.'
  } else if(msg.includes('Internal server error')){
    return 'Internal server error.'
  } else if(msg.includes('too many existing orders.') || msg.includes('has too many outstanding orders.') || msg.includes('Outstanding order to wallet balance')){
    return 1
  } else if(msg.includes('Bid amount is not 5.0% higher than the previous bid')){
		skip_list.push(asset.slug + asset.token_id)
		console.log(skip_list)
    return 'Bid amount is not 5.0% higher than the previous bid'
  } else if(msg.includes('Cannot read properties of undefined')){
      return "Cannot read properties of undefined"
  }
  return 0
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
// document.getElementById('account_name').innerHTML += values.default.API_KEY
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

// function pause() {
//   clearInterval(timerInterval);
// }

function reset() {
  clearInterval(timerInterval);
  print("00:00:00:00");
  elapsedTime = 0;
}