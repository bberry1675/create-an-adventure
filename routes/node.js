let express = require('express');
let Nodes = require('../models/story_node');


let router = new express.Router();

router.get('/:node_id', (req,res,next) => {
    let request_id = req.params.node_id;

    Nodes.findById(request_id, (err,doc) => {
        if(err){
            res.status(500).json({error: 'Finding node by ID failed'});
            return;
        }
        else{
            if(doc){
                //populate the document with the documents in action
                
                //send the HTMl template the text in the current story node

                //send the HTML template the action values and the corresponding _id values for the next documents
                res.json(doc);
                return;
            }
            else{
                res.status(404);
                return;
            }
        }
    });
});


module.exports = router;