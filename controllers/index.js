
module.exports.get_index = (req,res,next) => {
    console.log('in here');
    res.render('index',{starting_node: req.app.settings.starting_id});
    console.log('finished rendering');
    return;
}
