let express = require('express');
let router = express.Router()
let path = require('path')

//home page to start the adventure
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../views/index.html'));
});

module.exports = router;