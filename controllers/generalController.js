const secret = "YOURSECRETHERE";
const jwt = require('jsonwebtoken');

module.exports["getHome"] = function (req,res){
  		res.json({
  			text: 'Welcome'
  		})
}

module.exports["getPrivatePage"] = function (req,res){
      jwt.verify(req.token, secret, function (err, data) {
        if (err) {
          res.json({
            status: 0,
            message: "You have no access to this resource"
          });
        } else {
          //mongoose.Types.ObjectId(data.userId.id)
          res.json({
            status: 1,
            message: "You'r now inside the 51 Area!"
          })                  
        }
      }) 
}