// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

mongoose.connect('mongodb://wikiUser:password@localhost:27017/wiki');

var Page       = require('./app/models/page');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//middleware(function to call upon all requests)
router.use(function(req, res, next) {
    //Log
    console.log('Something is happening');
    next(); // Continue on w/o stopping here.
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

//Pages Routes
router.route('/pages')
// create a page (accessed at POST http://localhost:8080/api/pages)
.post(function(req, res) {

    var page = new Page();      // create a new instance of the Bear model
    page.title = req.body.title;  // set the bears name (comes from the request)
    page.content = req.body.content;

    // save the bear and check for errors
    page.save(function(err) {
        if (err)
        res.send(err);

        res.json({ message: 'Page created!' });
    });

})
//Get all pages.
.get(function(req, res){
    Page.find(function(err, pages){
        if(err)
        {
            res.send(err);
        }
        res.json(pages);
    });
});

router.route('/pages/:page_id')
.get(function(req, res){
    Page.findById(req.params.page_id, function(err, page){
        if(err)
        {
            res.send(err);
        }
        res.json(page);
    })
})
.put(function(req, res){
    Page.findById(req.params.page_id, function(err, page){
        if(err)
        {
            res.send(err);
        }

        page.title = req.body.title;
        page.content = req.body.content;

        page.save(function(err){
            if(err)
            {
                res.send(err);
            }
            res.json({message: 'Page Updated'});
        })
    })
})
.delete(function(req, res) {
    Page.remove({
        _id: req.params.page_id
    }, function(err, page){
        if(err)
        {
            res.send(err);
        }
        res.json({message: 'Successfully Deleted.'});
    });
});

// REGISTER OUR ROUTES -------------------------------
// all of our


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
