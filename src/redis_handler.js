const node_redis = require('redis')

const client = node_redis.createClient({
	url: "redis://10.0.0.77:6379",
});
client.connect();
client.on('error', (err) => console.log('Redis Client Error', err));

async function dump_queue(queue_name){
	console.log(await client.LLEN("queue:" + queue_name))
	client.DEL('queue:' + queue_name)
	console.log(await client.LLEN("queue:" + queue_name))
}
async function print_queue_length(queue_name){
	console.log('Queue: ' + await client.LLEN("queue:" + queue_name))
}
async function get_queue_length(queue_name){
	return await client.LLEN("queue:" + queue_name)
}

async function redis_push_asset(asset) {
	await client.rPush('queue:manual', JSON.stringify(asset));
}
async function redis_push_asset_flash(asset) {
	await client.rPush('queue:flash', JSON.stringify(asset));
}
async function push_asset_high_priority(asset) {
	await client.rPush('queue:high', JSON.stringify(asset));
}

module.exports = { client, print_queue_length, dump_queue };