var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var schema = mongoose.Schema

app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://localhost/login", function(err){
    if(err){
        console.log("DB Error!")
        throw err
    }
    else{
        console.log("DB Connect Success!")
    }
})

var UserSchema = new schema({
    username:{
        type: String
    },
    id: {
        type: String
    },
    password: {
        type: String
    }
})

var User = mongoose.model('user', UserSchema)

app.listen(8681, function(){
    console.log("Server Running at 8681 Port")
})

app.get('/', function(req, res){
    res.send("Hello")
})

app.post('/login', function(req,res){
    User.findOne({
        id: req.param('id')
    }, function(err, result){
        if(err){
            console.log('login ERR : '+err)
            throw err
        }
        if(result){
            if(result.password == req.param('password')){
                console.log('Login : '+result.username)
                res.json({
                    success: true,
                    message: result.username
                })
            }
            else if(result.password != req.param('password')){
                console.log('Password Error : '+result.username)
                res.json({
                    success: false,
                    message: "Password Error"
                })
            }
        }
        else{
            console.log("ID Error")
            res.json({
                success: false,
                message: "ID Error"
            })
        }
    })
})

app.post('/register', function(req, res){
    user = new User({
        username: req.param('username'),
        id: req.param('id'),
        password: req.param('password')
    })
    User.findOne({
        id: req.param('id')
    }, function(err, result){
        if(err){
            console.log("/register Error : "+err)
            throw err
        }
        if(result){
            res.json({
                success: false,
                message: "Already Input User"
            })
        }
        else{
            user.save(function(err){
                if(err){
                    console.log("User save Error")
                    throw err
                }
                else{
                    console.log(req.param('username')+" Save success")
                    res.json({
                        success: true,
                        message: "Register Success"
                    })
                }
            })
        }
    })
})

app.post('/remove', function(req, res){
    User.findOne({
        id: req.param('id')
    },function(err, result){
        if(err){
            console.log('/remove Error')
            throw err
        }
        if(result){
            if(result.password==req.param('password')){
                user.remove({id: req.param('id')}, function(err){
                    if(err){
                        console.log('remove Error')
                        throw err
                    }
                    else{
                        console.log(result.username+' user remove success')
                        res.json({
                            success: true,
                            message: "user delete success"
                        })
                    }
                })
            }
            else if(result.password != req.param('password')){
                console.log(result.username+' password Error')
                res.json({
                    success: false,
                    message: "Password Error"
                })
            }
        }
        else {
          console.log('User Not Founded')
            res.json({
                        success: false,
                        message: "user not founed"
            })
        }
    })
})
