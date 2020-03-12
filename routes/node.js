let express = require('express');
const nodeController = require('../controllers/node')

let router = new express.Router();

router.get('/:node_id', nodeController.add_node_to_session ,nodeController.get_node);

router.post("/:node_id/new", nodeController.validate_post_new_node() ,nodeController.post_new_node);


module.exports = router;