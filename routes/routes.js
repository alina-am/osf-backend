const express = require('express');
const router = express.Router();
const path = require("path");
const ejs = require('ejs');
//const https = require('https');
const got = require('got');

const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api';
const secretKey = '$2a$08$s/sg8ICyzui.5npPWwPq6u1RwzmABW.cVCGYrr6CmsLxGggoPEx4.';

async function getBreadcrumbs(id) {
	const navArray = [];
	got(`${base_url}/categories/parent/${id}?secretKey=${secretKey}`, { async: true }).then(response => {
		const parent = response.body;
		navArray.push(parent[0].parent_category_id);

		while (parent[0].parent_category_id != 'root') {
			got(`${base_url}/categories/parent/${id}?secretKey=${secretKey}`).then(response => {
				parent = response.body;
				console.log(parent);
				navArray.push(parent.parent_category_id);
			}).catch(error => {
				console.log(error.response.body);
				res.status(404).end();
			});
		}
	}).catch(error => {
		console.log(error.response.body);
		res.status(404).end();
	});
	return navArray;
}

// index page
router.get('/', (req, res, next) => {
	res.render('index', {
		title: 'Alibazon'
	});
});

// get all categories
router.get('/categories', (req, res, next) => {

	got(`${base_url}/categories/parent/root`, { searchParams: { secretKey: `${secretKey}` } }).then(response => {

		// main categories
		var mains = JSON.parse(response.body);
		mains[0].subcats = [];
		mains[1].subcats = [];

		for (let i = 0; i < mains.length; i++) {

			got(`${base_url}/categories/parent/${mains[i].id}`,
				{ searchParams: { secretKey: `${secretKey}` } })
				.then(response1 => {
					mains[i].subcats = JSON.parse(response1.body);

					if (i === mains.length - 1) {
						res.render('categories.ejs', {
							title: 'Alibazon',
							mains
						});
					}
				}).catch(error => {
					console.log(error.response1.body);
					res.status(404).end();
				});

		}
	}).catch(error => {
		console.log(error.response1.body);
		res.status(404).end();
	});
});

// get category by id
router.get('/categories/:id', (req, res, next) => {

	got(`${base_url}/products/product_search?id=${req.params.id}`,
		{
			searchParams: { secretKey: `${secretKey}` }
		}).then(response => {
			// returns products from one category
			let prod = null;
			prod = JSON.parse(response.body);
			console.log(`${req.params.id}`);
			res.render('category.ejs', {
				title: 'Alibazon',
				prod
			});
		}).catch(error => {
			console.log(error.response.body);
			res.status(404).end();
		});
});

// search for products
router.get('/products/productid=:prod_id', (req, res, next) => {
	got(`${base_url}/products/product_search`,
		{
			searchParams:
			{
				id: req.params.prod_id,
				secretKey: `${secretKey}`
			}
		}).then(response => {

			// returns one product
			const product = JSON.parse(response.body);
			res.render('product.ejs', {
				title: 'Alibazon',
				product,
				base_url,
				secretKey
			});
		});
});

// get category by parent id
router.get('/categories/parent/:parent-id', (req, res, next) => {

});

// get sign up page
router.get('/auth/signup', (req, res, next) => {
	res.send('You should register on this page');
});

// sign up 
router.post('/auth/signup', (req, res, next) => {
	res.send('User created!!');
});

// get sign in page
router.get('/auth/signup', (req, res, next) => {
	res.send('You should see the sign in page');
});

// sign in
router.get('/auth/signin', (req, res, next) => {
	res.send('Sign in successful');
});

//get cart
router.get('/cart', (req, res, next) => {
	res.send('You should see your cart on this page');
});

//add item to cart
router.post('/cart/addItem', (req, res, next) => {
	res.send('You should add an item to your cart on this page');
});

//remove item from cart
router.delete('/cart/removeItem', (req, res, next) => {
	res.send('You should delete an item from your cart on this page');
});

//change qty of item
router.post('/cart/changeItemQuantity', (req, res, next) => {
	res.send('You should the quantity of a product from your cart on this page');
});

//wishlist
router.get('/wishlist', (req, res, next) => {
	res.send('see wishlist');
});

// add item to wishlist
router.post('/wishlist/addItem', (req, res, next) => {
	res.send('add item to wishlist');
});

//remove item from wishlist
router.delete('/wishlist/removeItem', (req, res, next) => {
	res.send('delete item from wishlist');
});

//change qty of item in wishlist
router.post('/wishlist', (req, res, next) => {
	res.send('see wishlist');
});

//get orders
router.get('/orders?secretKey=', (req, res, next) => {
	//blabla
});

//create order
router.get('/orders', (req, res, next) => {
	//blabla
});

module.exports = router;

// exports.index = function(req, res) {
// 	res.render("index", { 
// 		// Template data
// 		title: "Express" 
// 	});
// };

// exports.hello = function(req, res) {
// 	var _         = require("underscore");
// 	var mdbClient = require('mongodb').MongoClient;

// 	mdbClient.connect("mongodb://localhost:27017/shop", function(err, db) {
// 		var collection = db.collection('categories');

// 		collection.find().toArray(function(err, items) {
// 			res.render("hello", { 
// 				// Underscore.js lib
// 				_     : _, 

// 				// Template data
// 				title : "Hello World!",
// 				items : items
// 			});

// 			db.close();
// 		});
// 	});
// };