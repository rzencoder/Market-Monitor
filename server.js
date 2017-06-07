require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser')
var axios = require('axios')
var mongoose = require('mongoose')
var mongodb = require('mongodb')

var app = express();

var MongoClient = mongodb.MongoClient;
var DB_URL = process.env.MLAB_URL || 'mongodb://localhost/market';


var server = require( "http" ).createServer( app );
var io = require( "socket.io" )( server);


app.use(bodyParser.urlencoded({ extended: false } ));
app.use(express.static('static'));

io.on('connection', (socket) => {
  console.log('a user connected');

	socket.on('initial-load', () => {

		MongoClient.connect(DB_URL, (err, db) => {
			db.collection('stocks').find().toArray( (error, response) => {
				if (!err && response.length !== 0) {
					response.map( (stock) => {
						axios.get('https://www.quandl.com/api/v3/datasets/WIKI/' + stock.code + '.json?api_key=' + process.env.QUANDL_API_KEY).then( (response) => {
							socket.emit('initial-stocks', response.data);
						}).catch(err => console.log(err));
					});
					db.close();
				}
			});
		});
	});

	socket.on('add', stock => {

		console.log(`Fetching ${stock} from Quandl`);
		axios.get('https://www.quandl.com/api/v3/datasets/WIKI/' + stock + '.json?api_key=' + process.env.QUANDL_API_KEY).then( (response) => {

			socket.emit('stock-added', response.data);
			socket.broadcast.emit('stock-added', response.data);
			MongoClient.connect(DB_URL, (err, db) => {
				console.log(`Adding ${stock} into db`);
				db.collection('stocks').insertOne({ code: stock });
				db.close();
			});
		}).catch( err => {
			   console.log(err)
		  });
	});

	socket.on('delete', stock => {

		MongoClient.connect(DB_URL, (err, db) => {
			db.collection('stocks').remove(
				{ code: stock },
				{ justOne: true }
			);
      console.log(`Deleted ${stock} from db` );
			socket.broadcast.emit('stock-deleted', stock);
		});
	});

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});



server.listen(process.env.PORT || 3001, () => {
  console.log('listening on port 3001');
});
