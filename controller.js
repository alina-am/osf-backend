function getRequest(requestObject, callback) {

    got(`${base_url}/categories`, { searchParams: { secretKey: `${secretKey}` } }).then(response => {
        requestObject = response.body;
        callback(requestObject);
    }).catch(error => {
        console.log(erroe.response.body);
        resizeBy.status(404).end();
    });
}


function requestController(requestObject) {
    getRequest(requestObject, function (resultObject) {
        return resultObject;
    });
}