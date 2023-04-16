const express = require("express");
const bodyParser = require("body-parser");
const https = require('https');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const first = req.body.firstName;
  const second = req.body.secondName;
  const email = req.body.yourEmail;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: first,
        LNAME: second
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/4b4b1d2e05";
  const options = {
    method: 'POST',
    auth: "Akash:f3214b2a41fbc47a2398ab8f159d66bf-us14"
  }
  const request = https.request(url, options, function(response) {
    const code = response.statusCode;
    if(code === 200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();

});

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server has started on port 3000");
})

// API Key
// f3214b2a41fbc47a2398ab8f159d66bf-us14

// Audience ID
// 4b4b1d2e05
