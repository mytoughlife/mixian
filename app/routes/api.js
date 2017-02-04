var express = require('express');
var router = express.Router();
var uuid = require('uuid');

var TABLE_NAME = 'MixianTable';

function makeSpace(input){
	if (input == '' || input == null){
		return ' ';
	}
	else {
		return input;
	}
}

router.route('/items')
	//gets all items
	.post(function(req, res){

		console.log('[API] Create new item.');

		docClient.put({ 
			TableName: TABLE_NAME, 		
			Item: {
				'id': uuid.v4(),
				'created_at': new Date().toISOString(),
                'name' : req.body.name,
				'alias' : makeSpace(req.body.alias),
				'address' : makeSpace(req.body.address),
				'link' : makeSpace(req.body.link)
            }
		}, 
		function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				res.status(200).send(data.Item);
			}
		});

	})
	.get(function(req, res){
		
		console.log('[API] Query all items.');

		var docClient = global.docClient;

		docClient.scan({TableName: TABLE_NAME}, function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err); 
			} else {

				data.Items.sort(function(a,b){
					return new Date(a.created_at) - new Date(b.created_at);
				});

				res.status(200).send(data.Items);
			}
		});

	});

router.route('/items/:id')
	//gets specified item
	.get(function(req, res){
		
		console.log('[API] Get item: ' + req.params.id);

		docClient.get({ TableName: TABLE_NAME, Key: {id: req.params.id} }, function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				res.status(200).send(data.Item);
			}
		});
	}) 

	//Updates existing item
	.put(function(req, res){

		console.log('[API] Update item: ' + req.body.name);

		docClient.update({ 
			TableName: TABLE_NAME, 
			Key: {id: req.params.id},
			UpdateExpression: 'set #name = :name, #alias = :alias, #address = :address, #link = :link',
  			ExpressionAttributeNames: {
				'#name' : 'name',
				'#alias' : 'alias',
				'#address' : 'address',
				'#link' : 'link'
			},			
			ExpressionAttributeValues: {
                ':name' : req.body.name,
				':alias' : makeSpace(req.body.alias),
				':address' : makeSpace(req.body.address),
				':link' : makeSpace(req.body.link)
            }
		}, 
		function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				res.status(200).send(data.Item);
			}
		});
	})
	
	//deletes the item
	.delete(function(req, res) {

		console.log('[API] Delete item: ' + req.params.id);

		docClient.delete({ TableName: TABLE_NAME, Key: {id: req.params.id} }, function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				res.status(200).send(data.Item);
			}
		});
	});

module.exports = router;