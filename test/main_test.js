var expect = require('chai').expect;
var assert = require('chai').assert;
const got = require('got');


const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api';
const secretKey = '$2a$08$s/sg8ICyzui.5npPWwPq6u1RwzmABW.cVCGYrr6CmsLxGggoPEx4.';

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
function getBreadcrumbsCategory(id) {
    let navArray = [];
    let parentId = id;
    navArray.unshift(id);

    return got(`${base_url}/categories/${parentId}`, { searchParams: { secretKey: secretKey } })
        .then(response => {
            let category = JSON.parse(response.body);

            if (category.primary_category_id != null) {
                parentId = category.primary_category_id
            }
            else {
                parentId = category.parent_category_id;
            }
            navArray.unshift(parentId);

            if (parentId != 'root') {
                return got(`${base_url}/categories/${parentId}`, { searchParams: { secretKey: secretKey } })
                    .then(response => {
                        let categ = JSON.parse(response.body);
                        parentId = categ.parent_category_id;
                        navArray.unshift(parentId);
                        if (parentId == 'root') {
                            return navArray;
                        } else {
                            return got(`${base_url}/categories/${parentId}`, { searchParams: { secretKey: secretKey } })
                                .then(response => {
                                    let categ = JSON.parse(response.body);
                                    parentId = categ.parent_category_id;
                                    navArray.unshift(parentId);
                                    if (parentId == 'root') {
                                        return navArray;
                                    } else {
                                        return got(`${base_url}/categories/${parentId}`, { searchParams: { secretKey: secretKey } })
                                            .then(response => {
                                                let categ = JSON.parse(response.body);
                                                parentId = categ.parent_category_id;
                                                navArray.unshift(parentId);
                                                if (parentId == 'root') {
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
            else return navArray;
        });
}

//Test suite
describe('Mocha', function () {
    //test spec (=unit test)
    it('should run our tests with npm', function () {
        expect(true).to.be.ok;
    });
});

describe('getMainCategories', function () {

    it('should return the children categories of root', function () {
        getMainCategories().then(mains => {
            expect(mains).to.be.ok;
        });
    });
});

describe('getBreadcrumbs', function () {

    let goodCategId = 'womens-clothing';
    let wrongCategId = 'fbsduv';

    it('should return a navigation array of the IDs to get to that category/product', function (done) {

        getBreadcrumbsCategory(goodCategId).then(nav => {
            expect(nav).to.be.ok;
            done();
        });

        getBreadcrumbsCategory(wrongCategId).then(nav => {
            expect(res.statusCode).to.equal(400);
            done();
        });
    });
});