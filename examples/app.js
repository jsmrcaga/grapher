const express = require('express');
const app = express();
const WebSocketServer = require('ws').Server; 
const server = require('http').createServer(app);
const wss = new WebSocketServer({server: server});

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());

app.options('*', cors());

var mustache = require('mustache-express');
app.engine('html', mustache());
app.set('view engine', 'html');

app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res, err){
	return res.render('index');
});


// WEBSOCKET
const names = ['Randy', 'Jo', 'Qwerty', 'Kathy', 'Ramon', 'Agatha', 'Shun Mei', 'Lolilol'];
const edge_types = ['Knows', 'Loves', 'Hates', 'Fancy'];
let ids = [];

wss.on('connection', ws => {
	setInterval(() => {
		let id = Math.floor(Math.random() * 1000);
		ids.push(id);

		ws.send(JSON.stringify({
			nodes: [{
				id: id,
				label: names[Math.floor((Math.random() * names.length))],
				type: 'Person'
			}],
			edges: [{
				from: ids[Math.floor(Math.random() * ids.length)],
				to: ids[Math.floor(Math.random() * ids.length)],
				type: edge_types[Math.floor(Math.random() * edge_types.length)]
			}]
		}));
	}, 3000);
});

server.listen(1234, function(){
	console.log('Server listening on port 1234!');
});