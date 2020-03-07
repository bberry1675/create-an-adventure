const Nodes = require('../models/story_node')

module.exports.get_node = (req,res,next) => {
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
                doc.populate('next',(err, populated_doc) => {
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
}

module.exports.post_new_node = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({errors: errors.array()});
        return;
    }

    let parent_node_id = req.params.node_id;

    let new_story_node = new Nodes({
        action: req.body.action,
        story: req.body.story,
        next: []
    });

    Nodes.findById(parent_node_id, (err, parent)=>{
        if(err){
            res.status(500).json({error: 'Finding node by ID failed'});
            return;
        }
        else{
            new_story_node.save((err, product) => {
                if(err){
                    res.status(500).json({error: 'Saving the new node failed'});
                    return;
                }
                else{
                    parent.next.push(product._id);
                    parent.save((err, parent_product) => {
                        if(err){
                            res.status(500).json({error: 'Saving the parent node failed'})
                            return;
                        }
                        else{
                            res.redirect(`/node/${product._id}`);
                            return;
                        }
                    })
                }
            })
        }
    })
}