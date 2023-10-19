const app = require('express').Router();
const _ = require('../../controllers/sprint2/stripe.controller');

app.post('/create', _.stripe);
app.post('/refund', _.refund);
app.post('/pay/tips/order', _.stripeTipsPayment);

module.exports = app;