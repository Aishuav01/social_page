var express = require('express')
var app = express()
app.use(express.static('static'));
var mongojs = require('mongojs')
var db = mongojs('mongodb://aishu:aishu@cluster0-shard-00-00-8tyhc.mongodb.net:27017/club?ssl=true&authSource=admin&?replicaSet=Cluster0-shard-0', ['user'])
app.set('view engine', 'ejs');
 
app.get('/', function (req, res) {
  res.sendFile(__dirname+'/static/signup.html')
})
app.get('/log', function (req, res) {
    res.sendFile(__dirname+'/static/login.html')
  })

app.get('/signup', function (req, res) {
    var dat =  {
        name:req.query.name,
        email:req.query.email,
        uname:req.query.username,
        pwd:req.query.password
    }
    var em ={
        email:req.query.email
    }

    db.user.find(em,function(err,data){
        if(err)
        {
            res.send('something went wrong')
        }
        else
            {
            if(data.length>0)
            {
                res.send('Email exists')
            }
            else
            {
                
                db.user.insert(dat, function(err,data){
                if(err)
                {
                res.send('Something went wrong')
                }
                else
                {
                    res.sendFile(__dirname+'/static/login.html')
                }
                
            })
       }
    }
})
    
})



app.get('/login', function (req, res) {
    var da={
        email:req.query.email,
        pwd:req.query.password
    }
    db.user.find(da, function(err,data){
        if(err)
        {
            res.send('Something went really wrong')
        }
        else
        {
            if(data.length>0)
            {
                console.log(data)

				db.user.find({}, function(err,dat){
					if(err){
						res.send('something went wrong')
					}
					else{
						console.log(dat)
						res.render('dash', {res:data, use: dat})
					}
				})
            }
            else
            {
                res.send('Wrong email/password')
            }
        }
    })
  })
  app.get('/signup/:email', function(req,res){
	
    db.user.find({Email:req.params.email}, function(err,data){
        if (err) { 
                res.send('something went wrong')
            }
            else{
    
            res.render('das', { use: data})
            }
    })
    
    })

 
app.listen(3000)