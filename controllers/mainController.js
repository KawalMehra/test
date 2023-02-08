const db = require('../db/database.js');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(file)
        cb(null, '../Images')   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)      
    }
})
var upload = multer({ storage: storage });

module.exports = {
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    homePage: (req, res) => {
      var query = `select * from products ORDER BY RecordID DESC LIMIT 8`;
      var query2 = `select * from category`;
      var query3 = `select * from products`;
      db.query(query, function (err, data, fields) {
             if (err) throw err;
                 db.query(query2, function(err2, data2, fields2){
                      db.query(query3, function(err3, data3, fields3){
                                res.render('home',{data:data, data2:data2, data3:data3})
                      })
                 }) 
              })
    },
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CountCart: (req, res) => { 
        var query = `SELECT Count(RecordID) AS Count FROM test.customer_cart WHERE CustomerID='1'`;
            db.query(query, function (err, data, fields) {
             if (err) throw err;
                 data.forEach(function(val,key){
                        count = val;
                 })
                 req.session.CountCart=count;
              res.send(req.session.CountCart);
          });
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Shop: (req, res)=>{
       var ProductType = req.query.ProductType;
      if(ProductType){
           var where = `WHERE ProductType='${ProductType}'`;
       }else{
           var where = '';
       }
       var query = `select * from test.products ${where}`;
            db.query(query, function (err, data, fields) {
             if (err) throw err;
              res.render('Shop',{data:data, ProductType:ProductType});
          });
    },
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ShoppingCart: (req, res) => { 
        CustomerID = req.session.CustomerID;
        var query = `select customer_cart.Quantity , customer_cart.RecordID, products.Name, products.price from customer_cart 
                     INNER JOIN products ON products.RecordID = customer_cart.ProductID
                     WHERE CustomerID=${CustomerID}`;
        db.query(query, function (err, data, fields) {
            res.render('shopping-cart',{data:data});
        })
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    deleteCartRecord: (req, res)=>{
        RecordID= req.body.RecordID;
        var query = `delete from customer_cart WHERE RecordID='${RecordID}'`;
        db.query(query, function (err, data, fields) {
             res.send(data)
        })
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Checkout: (req, res) => { 
        var CustomerID = req.session.CustomerID;
        var query = `select customer_cart.Quantity , customer_cart.RecordID, products.Name, products.price from customer_cart 
                     INNER JOIN products ON products.RecordID = customer_cart.ProductID
                     WHERE CustomerID=${CustomerID}`;
        db.query(query, function(err, data, fields){
              res.render('checkout',{data:data})
        })
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    login: (req, res) => { 
       req.session.destroy();
        res.render('login');
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Contact: (req, res) => { 
        res.render('contact');
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ShowtableProduct: (req,res)=>{
        var query = `select * from products`;

       db.query(query, function (err, data, fields) {
             if (err) throw err;
              res.render('ShowTableProduct',{userData: data});
          });
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    AddProducts: (req,res)=>{
        res.render('AddProducts');
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    InsertProduct: (req,res)=>{
        var Name = req.body.Name;
       var ProductType = req.body.ProductType;
       var Price = req.body.Price;
       var Quantity = req.body.Quantity;
        var image = req.files.image;
        upload.single('image');
       
        //console.log(req.files)
      /// var query = `INSERT INTO test.products(Name,ProductType,price,Quantity)
                 //   VALUES('${Name}','${ProductType}','${Price}','${Quantity}')`;

       // db.query(query, function (err, data, fields) {
       //       if (err) throw err;
       //        res.redirect('/ShowTableProduct');
       //    });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    EditProduct: (req,res)=>{
        var query = `select * from products WHERE RecordID='${req.query.id}'`;

       db.query(query, function (err, data, fields) {
             if (err) throw err;
              res.render('EditProduct',{data:data});
          });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    UpdateProduct: (req,res)=>{
       var RecordID = req.body.RecordID;
       var Name = req.body.Name;
       var ProductType = req.body.ProductType;
       var Price = req.body.Price;
       var Quantity = req.body.Quantity;

       var query = `UPDATE test.products SET Name='${Name}', ProductType='${ProductType}', Price = '${Price}',
           Quantity = '${Quantity}' WHERE RecordID = '${RecordID}'`;

       db.query(query, function (err, data, fields) {
             if (err) throw err;
              res.redirect('/ShowTableProduct');
          });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    addincart:(req,res)=>{
         if (!req.session.CustomerID) {
               req.session.CustomerID = req.query.ProductID;
               res.render('contact');
    }
    else {
              res.send(req.session.CustomerID);
    }
      },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ajax:(req,res)=>{
         ProductID= req.body.ProductID;
         CustomerID= req.session.CustomerID;
         Quantity= req.body.Quantity;
         if(CustomerID){
         var query = `INSERT INTO customer_cart(ProductID,CustomerID,Quantity) VALUES('${ProductID}','${CustomerID}','${Quantity}')`;
         db.query(query, function (err, data, fields) {
             if (err) throw err;
              res.send('Product Added in Cart');
          });
       }else{
          res.send('Please Login First');
       }
      },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    register:(req,res)=>{
         Name= req.body.name;
         Email=req.body.email;
         var query = `INSERT INTO customer(Name,Email) VALUES('${Name}','${Email}')`;
         db.query(query, function (err, data, fields) {
             if (err) throw err;
              res.redirect('contact');
          });         
      },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    loginHere:(req,res)=>{
         Name= req.body.name;
         Email=req.body.email;
         var query = `select * from customer WHERE Name='${Name}' AND Email='${Email}'`;
         db.query(query, function (err, data, fields) {
             if (err) throw err;
               CheckLogin='';
                  data.forEach(function(val,key){
                        CheckLogin = val.Name;
                        RecordID = val.RecordID;
                 });
               if(CheckLogin){
                   req.session.CustomerID=RecordID;
                   res.redirect('/');
               }else{
                   res.send('Incorrect Login');
               }
          });
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ProductDetails:(req,res)=>{
        var query = `select * from products WHERE RecordID='${req.query.ProductID}'`;
        db.query(query, function(err, data, fields){
               res.render('ProductDetail',{data:data});
        })
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    auth:(req,res,next)=>{
         if(req.session.CustomerID){
              next();
         }else{
            res.render('contact');
         }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CheckCustomerID:(req, res, next)=>{
      CustomerID= req.session.CustomerID;
      var query = `SELECT Count(RecordID) AS Count FROM test.customer_cart WHERE CustomerID='${CustomerID}'`;
                db.query(query, function (err, data, fields) {
                  if(data){
                      data.forEach(function(val,key){
                            abc = val.Count;
                     })
                    count =abc;
                  }else{
                    count=2;
                  }
                  res.locals.Count=count;
                  if(res.locals.Count){
                        next();
                  }else{
                     res.locals.Count=0;
                      next();
                  }
              });
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    DeleteProduct: (req,res)=>{
        var RecordID = req.query.id;
        var query = `DELETE from products WHERE RecordID = '${RecordID}'`;
        db.query(query, function (err, data, fields) {
             if (err) throw err;
              res.redirect('/ShowTableProduct');
          });
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
   getdropdown: (req, res)=>{
       var searchkey = req.body.searchkey;
       var query = `select * from products WHERE Name LIKE '%${searchkey}%' LIMIT 2`;
       db.query(query, function (err, data, fields){
          var table = [];
            data.forEach(function(val,key){
                   table.push(`<li style="background-color:lightgrey;padding: 2px;margin-left:-13%;z-index: -100;"><a style="color: white" onclick="return getval('${val.Name}')" href="#">${val.Name}</li></a>`);
                 });
            res.send(table)
       })
   },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
   FilterProduct:(req,res)=>{
       var search = req.query.FilterI;
       var query = `select * from products WHERE Name LIKE '%${search}%' `;
        db.query(query, function(err, data, fields){
              res.render('Shop',{data:data})
        })
   },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
   filterbyprice:(req,res)=>{
       ValueOne = req.body.ValueOne;
       ValueTwo = req.body.ValueLast;
       var query = `select * from products WHERE price between '${ValueOne}' AND '${ValueTwo}'`;
       db.query(query, function(err, data, fields){
            var count = data.length;
            var table = [];
                data.forEach(function(val,key){
                       table.push(`<div class="col-lg-4 col-md-6 col-sm-6 pb-1">
                        <div class="product-item bg-light mb-4">
                            <div class="product-img position-relative overflow-hidden">
                                <img class="img-fluid w-100" src="img/product-1.jpg" alt="">
                                <div class="product-action">
                                    <a class="btn btn-outline-dark btn-square AddCart" onclick="return Load( ${val.RecordID})" id="${val.RecordID}"><i class="fa fa-shopping-cart"></i></a>
                                    <a class="btn btn-outline-dark btn-square" href="ProductDetails?ProductID=${ val.RecordID}"><i class="fa fa-search"></i></a>
                                </div>
                            </div>
                            <div class="text-center py-4">
                                <a class="h6 text-decoration-none text-truncate" href="">${val.Name}</a>
                                <div class="d-flex align-items-center justify-content-center mt-2">
                                    <h5>Rs. ${ val.price}</h5>
                                </div>
                                <div class="d-flex align-items-center justify-content-center mb-1">
                                    <small class="fa fa-star text-primary mr-1"></small>
                                    <small class="fa fa-star text-primary mr-1"></small>
                                    <small class="fa fa-star text-primary mr-1"></small>
                                    <small class="fa fa-star text-primary mr-1"></small>
                                    <small class="fa fa-star text-primary mr-1"></small>
                                    <small>(99)</small>
                                </div>
                            </div>
                        </div>
                    </div>`)
                });
              res.send({table:table,abc:count})
       })
   }
}