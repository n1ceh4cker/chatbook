exports.home = (req, res) =>{
    res.render('index.ejs', { user:req.user })
}