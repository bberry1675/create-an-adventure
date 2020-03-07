let express = require('express');
let router = express.Router()
const indexController = require('../controllers/index')

//home page to start the adventure
router.get('/', indexController.get_index);

module.exports = router;