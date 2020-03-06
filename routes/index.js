let express = require('express');
let router = express.Router()
let path = require('path')

//home page to start the adventure
router.get('/', (req, res) => {
    res.render('index', {starting_node: req.app.settings.starting_id})
});

module.exports = router;