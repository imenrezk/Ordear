const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const passport = require("passport");
const AuthRouter = require("./Auth.router");
const userSpaceRouter = require("./user.router");
const passportRouter = require("./passport.router");
const RequestRouter = require("./request.router");
const CategoryRouter = require("./category.router.js");
const MenuRouter = require("./menu.router.js");
const ProductRouter = require("./product.router.js");
const IngredientRouter = require("./ingredient.router.js");
const CartRouter = require('./cart.router');
const auth = require("../middleware/Auth");
const helpRequestRouter = require('./sprint2/help_request.router');
const taxRouter = require('./sprint2/tax.router');
const TableRouter = require('./sprint2/table.router');
const itemRouter = require('./item.router');
const OrderRouter = require('./sprint2/order.router');
const RestoRouter = require('./restaurant.route')
const NotifRouter = require('./sprint2/notification.router');
const NotifEmployeeRouter = require('./sprint2/notificationEmployee.router');
const StripeRouter = require('./sprint2/stripe.router');
const PrivilegeRouter = require('./sprint3/privilege.router');
const ReclamationRouter = require('./sprint4/reclamation.router');
const AvisRouter = require('./sprint4/avis.router');

router.use(cookieParser());
router.use(passport.initialize());

router.use("/auth", AuthRouter);
router.use("/user", userSpaceRouter);
router.use("/auth", passportRouter);
router.use("/", require("./facebook.router"));
router.use("/request", RequestRouter);
router.use("/category",  CategoryRouter); //auth,
router.use("/menu", MenuRouter); // auth,
router.use("/product",ProductRouter); // auth, 
router.use("/ingredient",  IngredientRouter); //auth,
router.use('/tax', taxRouter);  //auth,
router.use('/help',  helpRequestRouter); //auth,
router.use('/table', TableRouter); //auth,
router.use('/item', itemRouter);
router.use('/cart', CartRouter);
router.use('/order', OrderRouter);
router.use('/restaurant', RestoRouter);
router.use('/notification', NotifRouter);
router.use('/notification/employee', NotifEmployeeRouter)
router.use('/stripe', StripeRouter);
router.use('/privilege', PrivilegeRouter);
router.use('/reclamation', ReclamationRouter);
router.use('/avis', AvisRouter);

module.exports = router;