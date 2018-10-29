module.exports = (app) => {



app.get('/', function (req, res) {
var postmain = database.collection("posts").find({}).toArray(function (err, posts) {
            
            res.render('home.ejs', {
                posts: posts
    
            });
    });
});

//app.get('/post/:id', function (req, res) {
//   database.collection('posts').find({'id': req.params.id}).toArray(function (err, response){
//               
//            res.render('post.ejs', {
//                posts: response
//    
//            });
//    });
//});

app.get('/post/:id', function (req, res) {
     
    database.collection('posts').find({'_id':ObjectId(req.params.id)}).toArray(function (err, response){
        res.render('post.ejs', {
                posts: response
            });

    });
});

app.get('/login', function (req, res) {
    var auth = database.collection('ja_auth').findOne({}, function (err, results) {
        res.render('login.ejs', {
            ja_auth: results
        });
    });
});


app.get('/dashboard', (req, res) => {

    if (req.session.user && req.cookies.cookie_id) {
        var auth = database.collection('ja_auth').findOne({}, function (err, results) {
        var posted = database.collection("posts").find({}).toArray(function (err, posts) {
            
            res.render('dashboard.ejs', {
                ja_auth: results,
                user: results.user,
                posts: posts
    
            });

        });
             });

    } else {
        res.redirect('/login');
    }
   
});



app.post('/auth', function (req, response) {

    var login = database.collection('ja_auth').findOne({}, function (err, results) {



        if (results['user'] === req.body.user) {

            //  if (bcrypt.compareSync(req.body.pass, results['pass'])) {}

            bcrypt.compare(req.body.pass, results['pass'], function (err, res) {

                //                console.log(res);

                if (res == true) {
                    var data = {
                        user: req.body.user,
                        pass: req.body.pass
                    }

                    req.session.user = data;
                    
                    response.redirect('/dashboard');

                } else {
                    response.redirect('/login');
                }
            });




        } else {
            response.redirect('/login');
        }



    });

});

app.get('/addpost', (req, res) => {

    if (req.session.user && req.cookies.cookie_id) {
        res.render('addpost.ejs', {
            posts: res
        });

    } else {
        res.redirect('/login');
    }
});


app.post('/addpost', (req, res) => {

    database.collection('posts').save(req.body, function (err, request) {
        if (err) return console.log(err);
        
        });

 
    res.redirect('/dashboard');

});

app.get('/updatepost/:id', function(req, res){
    
    
     if (req.session.user && req.cookies.cookie_id) {
            database.collection('posts').find({'_id':ObjectId(req.params.id)}).toArray(function (err, response){
              
        res.render('update.ejs', {
            posts: response
        });
             });

    } else {
        res.redirect('/login');
    }

});


app.post('/updatepost/:id', function(req, res) {
  

  
  
    database.collection('posts').update({'_id':ObjectId(req.params.id)}, {$set: {title : req.body.title, content : req.body.content}}, {w:1}, function(err, result){
   
        });
        res.redirect('/dashboard');
    
   });


    

                                        
    


app.get('/deletepost/:id', function(req, res){
    
    
    database.collection('posts').deleteOne({'_id': ObjectId(req.params.id)}, function(err,result){
        
        if(err) return console.log(err);
        res.redirect('/dashboard');
    });
    
});


app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.cookie_id) {
        res.clearCookie('cookie_id');
        res.redirect('/login');
    } else {
        res.redirect('/login');
    }
});


app.use(function (req, res, next) {
    res.status(404).send("Error page 404!")
});