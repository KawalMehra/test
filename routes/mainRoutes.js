const Router  = require('express');
const {filterbyprice, FilterProduct, getdropdown, CheckCustomerID, auth, ShowCartDetails, deleteCartRecord, CountCart, homePage, ShoppingCart, Checkout, loginHere, login, Contact, register, ShowtableProduct, ajax, AddProducts, InsertProduct, session, EditProduct, UpdateProduct, DeleteProduct, Shop, addincart, ProductDetails } = require('../controllers/mainController.js')

const app = Router();

app.use(CheckCustomerID);
app.post('/loginHere',loginHere);
app.post('/getdropdown',getdropdown);
app.get('/login',login);
app.use(auth);
app.get('/', homePage);
app.get('/header', (req,res)=>{
	  res.render('partials/header')
});
app.get('/shopping-cart', ShoppingCart);
app.get('/checkout', Checkout);
app.get('/contact', Contact);
app.get('/ShowTableProduct', ShowtableProduct);
app.get('/AddProducts', AddProducts);
app.post('/InsertProduct',InsertProduct);
app.get('/EditProduct',EditProduct);
app.post('/UpdateProduct',UpdateProduct);
app.get('/DeleteProduct',DeleteProduct);
app.get('/Shop',Shop);
app.get('/addincart',addincart);
app.post('/ajax',ajax);
app.get('/CountCart',CountCart);
app.post('/register',register);
app.get('/ProductDetails',ProductDetails);
app.post('/deleteCartRecord',deleteCartRecord);
app.get('/FilterProduct',FilterProduct);
app.post('/filterbyprice',filterbyprice);
app.get('*',(req,res)=>{
    res.render('404')
})


module.exports = app;