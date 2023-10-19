const Order = require('../../models/sprint2/order.model');
const stripe = require('stripe')( process.env.STRIPE_KEY);
const jwt_decode = require("jwt-decode");

const StripeController = {

  stripe: async (req, res) => {
 
    const tokenLogin = req.cookies.tokenLogin;
    const decodeTokenLogin = jwt_decode(tokenLogin);
    const idUser = decodeTokenLogin.id;

    const order = await Order.findOne({ user: idUser }).sort({ createdAt: -1}).populate('user').populate({
      path: 'restaurantFK',
      populate: [
        { path: 'owner' },
      ]
    });

    const emailUser = order.user.email;
   
    try {
      const restaurantFKEmail = order.restaurantFK.owner.email;

      if (!restaurantFKEmail) {
        return res.status(500).json({ error: "Email Not Found" });
      } else {
        const paymentMethod = await stripe.paymentMethods.create({
          type: 'card',
          card: {
            number: "4242424242424242",
            exp_month: 9,
            exp_year: 24,
            cvc: "123",
          },
        });

        const customer = await stripe.customers.create({
          email: emailUser,
          payment_method: paymentMethod.id,
          invoice_settings: {
            default_payment_method: paymentMethod.id,
          },
        });


        const ephemeralKey = await stripe.ephemeralKeys.create(
          { customer: customer.id },
          { apiVersion: '2022-11-15' }
        );
        const amountInCents = Math.round(order.totalPrice * 100);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: 'usd',
          customer: customer.id,
          payment_method_types: ['card',],
        });
        
        res.json({
          paymentIntent: paymentIntent.client_secret,
          ephemeralKey: ephemeralKey.secret,
          customer: customer.id,
          publishableKey: process.env.PUBLISH_STRIPE_KEY,
        });

        order.payment_intent = paymentIntent.id
        order.save();
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      let message = 'An error occurred while processing your payment.';

      if (error.type === 'StripeCardError') {
        message = error.message;
      }

      res.status(500).json({ error: 'Payment failed' });
    }
  },

  refund: async (req, res) => {
    
    try {
      const tokenLogin = req.cookies.tokenLogin;
      const decodeTokenLogin = jwt_decode(tokenLogin);
      const idUser = decodeTokenLogin.id;
  
      const order = await Order.findOne({ user: idUser, statusOrder:'Canceled' }).sort({ updatedAt: -1}).populate('user');

      const amountInCents = Math.round(order.totalPrice * 100);
    if(order.payMethod === "Credit card") {

      if (order.statusRefunded) {
        return res.status(400).json({ message: 'La commande a déjà été remboursée' });
      }

      const refund = await stripe.refunds.create({
        payment_intent: order.payment_intent,
        amount: amountInCents,
      });
  
      if (refund.status === 'succeeded') {
        res.status(200).json({ message: 'Remboursement réussi !' });
        order.statusRefunded =true;
        order.save();
      } else {
        res.status(400).json({ message: 'Échec du remboursement ', failure_reason: refund.failure_reason });
      }
    }else {
      res.status(500).json({ message: 'Pay method not equal to Credit Card' });
    }
    } catch (error) {
      console.error('Erreur lors du remboursement : ', error);
      res.status(500).json({ message: 'Erreur lors du remboursement' });
    }
  },
  
  stripeTipsPayment : async (req, res) => {

    const tokenLogin = req.cookies.tokenLogin;
    const decodeTokenLogin = jwt_decode(tokenLogin);
    const idUser = decodeTokenLogin.id;

    const order = await Order.findOne({user : idUser}).sort({dateAvis : -1}).populate('user').populate('restaurantFK');
    const amountTips = req.body.amountTips;

    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            number: "4242424242424242",
            exp_month: 9,
            exp_year: 24,
            cvc: "123",
        },
    });

    const customer = await stripe.customers.create({
        email: order.user.email,
        payment_method: paymentMethod.id,
        invoice_settings: {
            default_payment_method: paymentMethod.id,
        },
    });

    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2022-11-15' }
    );

    const amountInCents = Math.round(amountTips* 100);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        customer: customer.id,
        payment_method_types: ['card',],
    });
    res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: process.env.PUBLISH_STRIPE_KEY,
      });

    order.statusTips = true;
    order.statusMethodTips = "Credit Card";
    order.dateAvis = order.dateAvis;
    order.amountTips = amountTips;
    await order.save();

  
},

}
module.exports = StripeController;