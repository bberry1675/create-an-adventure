
module.exports.get_index = (req,res,next) => {
    res.render('index',{starting_node: req.app.settings.starting_id});
    return;
}
