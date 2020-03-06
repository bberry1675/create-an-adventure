let express = require('express');
let Nodes = require('../models/story_node');
const {check} = require('express-validator')


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
                doc.populate((err, populated_doc) => {
                    if(err){
                        res.status(500).json({error: 'Failed to populate the current node'});
                        return;
                    }
                    else{
                        res.render('node', {
                            node_id: populated_doc._id,
                            story: populated_doc.story,
                            actions: populated_doc.next
                        })
                        return;
                    }
                })

                
            }
            else{
                res.status(404);
                return;
            }
        }
    });
});

router.post("/:node_id/new", [check('action'), check('story')] ,(req,res,next) => {
    let parent_node = req.params.node_id;
    console.log(`action: [${req.body.action}] story: [${req.body.story}]`);
    res.json(req.body);
    return;
});


module.exports = router;