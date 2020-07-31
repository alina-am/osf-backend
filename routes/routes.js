const express = require('express');
const router = express.Router();
const got = require('got');
const { response } = require('express');

const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api';
const secretKey = '$2a$08$s/sg8ICyzui.5npPWwPq6u1RwzmABW.cVCGYrr6CmsLxGggoPEx4.';


// index page
router.get('/', (req, res, next) => {
	res.redirect('/home');
});

// get sign in page
router.get('/signin', (req, res, next) => {
	res.render('signin', {
		title: 'Alibazon',
	});
});

// get sign up page
router.get('/signup', (req, res, next) => {
	res.render('signup', {
		title: 'Alibazon',
		base_url
	});
});

function getBreadcrumbsCategory(id) //some really bad code in here..
{
	let navArray = [];
	//navArray.unshift({ parentId, name });

	return got(`${base_url}/categories/${id}`, { searchParams: { secretKey: secretKey } })
		.then(response => {
			let categ = JSON.parse(response.body);

			name = categ.name;
			navArray.unshift({ id, name });

			if (categ.primary_category_id != null) {
				parentId = category.primary_category_id
			}
			else {
				parentId = categ.parent_category_id;
			}

			if (parentId != 'root') {
				return got(`${base_url}/categories/${parentId}`, { searchParams: { secretKey: secretKey } })
					.then(response => {
						let categ = JSON.parse(response.body);

						name = categ.name;
						navArray.unshift({ id: parentId, name });
						parentId = categ.parent_category_id;

						if (parentId == 'root') {
							navArray.unshift({ id: 'home', name: 'Home' });
							return navArray;
						} else {
							return got(`${base_url}/categories/${parentId}`, { searchParams: { secretKey: secretKey } })
								.then(response => {
									let categ = JSON.parse(response.body);

									name = categ.name;
									navArray.unshift({ id: parentId, name });
									parentId = categ.parent_category_id;

									if (parentId == 'root') {
										navArray.unshift({ id: 'home', name: 'Home' });
										return navArray;
									} else {
										return got(`${base_url}/categories/${parentId}`, { searchParams: { secretKey: secretKey } })
											.then(response => {
												let categ = JSON.parse(response.body);

												name = categ.name;
												navArray.unshift({ id: parentId, name });
												parentId = categ.parent_category_id;

												if (parentId == 'root') {
													navArray.unshift({ id: 'home', name: 'Home' });
													return navArray;
												}
											}).catch(error => {
												console.log(error);
											});
									}
								}).catch(error => {
									console.log(error);
								});
						}
					}).catch(error => {
						console.log(error);
					});
			}
			else {
				navArray.unshift({ id: 'home', name: 'Home' });
				return navArray;
			}
		});
}

function getMainCategories() {
	return got(`${base_url}/categories/parent/root`, { searchParams: { secretKey: `${secretKey}` } })
		.then(response => {

			// main categories
			let mains = JSON.parse(response.body);
			mains[0].subcats = [];
			mains[1].subcats = [];
			return mains;
		})
		.catch(error => {
			console.log('error from getMains: ' + error);
		});
}

// get all categories
router.get('/home', function (req, res, next) {

	// main categories
	getMainCategories().then(mains => {

		for (let i = 0; i < mains.length; i++) {

			got(`${base_url}/categories/parent/${mains[i].id}`,
				{ searchParams: { secretKey: `${secretKey}` } })
				.then(response => {
					mains[i].subcats = JSON.parse(response.body);

					if (i === mains.length - 1) {
						res.render('categories.ejs', {
							title: 'Alibazon',
							mains,
							navArray: [{ id: 'home', name: 'Home' }, { id: 'categories', name: 'Categories' }]
						});
					}
				}).catch(error => {
					console.log(error);
					res.status(404).end();
				});
		}
	}).catch(error => {
		console.log(error);
		res.status(404).end();
	});
});

// get category by id
router.get('/categories/:id', (req, res, next) => {

	const hasSubcategory = ['mens', 'womens', "mens-clothing", "mens-accessories", "womens-clothing", "womens-jewelry", "womens-accessories"];

	if (hasSubcategory.includes(req.params.id)) {
		got(`${base_url}/categories/${req.params.id}`, { searchParams: { secretKey: `${secretKey}` } }).then(response => {

			// main categories
			var mains = [];
			mains.push(JSON.parse(response.body));
			mains.subcats = [];

			for (let i = 0; i < mains.length; i++) {

				got(`${base_url}/categories/parent/${mains[i].id}`,
					{ searchParams: { secretKey: `${secretKey}` } })
					.then(response => {
						mains[i].subcats = JSON.parse(response.body);

						getBreadcrumbsCategory(req.params.id).then(navArray => {

							if (i === mains.length - 1) {
								res.render('categories.ejs', {
									title: 'Alibazon',
									mains,
									navArray
								});
							}
						}).catch(error => {
							console.log(error);
						});
					}).catch(error => {
						console.log(error);
						res.status(404).end();
					});
			}
		}).catch(error => {
			console.log(error.response.body);
			res.status(404).end();
		});
	}
	else {
		got(`${base_url}/products/product_search`,
			{
				searchParams:
				{
					secretKey: `${secretKey}`,
					primary_category_id: req.params.id
				}
			}).then(response => {

				// returns products from subsubcategory
				let prod = null;
				prod = JSON.parse(response.body);

				getBreadcrumbsCategory(req.params.id).then(navArray => {
					res.render('category.ejs', {
						title: 'Alibazon',
						prod,
						navArray
					});
				}).catch(error => {
					console.log(error);
				});
			}).catch(error => {
				console.log(error);
				res.status(404).end();
			});
	}
});

// Product page
router.get('/products/productid=:prod_id', (req, res, next) => {
	got(`${base_url}/products/product_search`,
		{
			searchParams:
			{
				id: req.params.prod_id,
				secretKey
			}
		}).then(response => {

			// returns one product
			const product = JSON.parse(response.body);

			getBreadcrumbsCategory(product[0].primary_category_id).then(navArray => {

				navArray.push({ id: product[0].id, name: product[0].name });

				res.render('product.ejs', {
					title: 'Alibazon',
					product,
					navArray
				});
			}).catch(error => {
				console.log(error);
			});

		}).catch(error => {
			console.log(error.response.body);
			res.status(404).end();
		});
});

module.exports = router;
