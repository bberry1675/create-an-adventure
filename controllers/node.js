const Nodes = require('../models/story_node')
const {check, validationResult} = require('express-validator')
const Users = require('../models/user')

function checkActionAndStoryWhitespace(action, story){
    let trimmedAction = action.replace(/\s/g, "");
    let trimmedStory= story.replace(/\s/g, "");
    return  trimmedAction.length >= 4 &&
            trimmedAction.length <= 50 &&
            trimmedStory.length >= 50 &&
            trimmedStory.length <= 300
}

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
                            actions: populated_doc.next,
                            user: req.user,
                            starting_id: req.app.settings.starting_id
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

module.exports.validate_post_new_node = () => {
    return [check('action').isLength({min: 4, max: 50}), check('story').isLength({min: 50, max: 300})];
}

module.exports.post_new_node = (req,res,next) => {

    if(!req.user){
        res.status(401).json({errors: ['Must sign in before adding to the story']})
        return;
    }

    if(req.user.added_node){
        res.status(403).json({errors: ['Already created a node']});
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({errors: errors.array()});
        return;
    }

    if(!checkActionAndStoryWhitespace(req.body.action,req.body.story)){
        res.status(422).json({errors: ['Action must contain 4 to 50 characters and story must contain 50 to 300 characters']});
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
                            Users.findById(req.user._id,(err, userDoc) => {
                                if(err){
                                    //TODO: Could not find the user document
                                }

                                if(userDoc){
                                    userDoc.added_node = product._id;
                                    userDoc.save((err, savedUser) => {
                                        if(err){
                                            //TODO: could not save the user document with the created node id
                                        }

                                        res.redirect(`/node/${product._id}`);
                                        return;
                                    })
                                }
                            })
                            
                        }
                    })
                }
            })
        }
    })
}

module.exports.add_node_to_session = (req,res,next) => {
    req.session.current_node = req.params.node_id;
    next();
}