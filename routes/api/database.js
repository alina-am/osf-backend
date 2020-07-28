const fs = require('fs');

fs.readFile('../../db/products.json', 'utf8', (err, fileContents) => {
    if (err) {
        console.error(err)
        return;
    }
    try {
        const data = JSON.parse(fileContents);
        console.log(data);
    } catch (err) {
        console.error(err);
    }
})