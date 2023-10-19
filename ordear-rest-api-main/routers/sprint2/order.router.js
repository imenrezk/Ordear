const express = require('express');
const router = express.Router();
const orderController = require ("../../controllers/sprint2/order.controller")

router.post('/add/order', orderController.addOrder);
router.get('/getAllOrder', orderController.getAllOrders);
router.get('/get/all/By/user', orderController.getAllOrdersByUser);
router.get('/get/order/By/user', orderController.getOrderByUser);
router.get('/get/order/review/not/added', orderController.getOrderWhereReviewNotAdded);
router.get('/getById/:id', orderController.getOrderById);
router.get('/getStatus', orderController.getStatus);
router.put('/acceptOrder/:id', orderController.acceptOrder);
router.put('/refuseOrder/:id', orderController.refuseOrder);
router.put('/updateOrder/:id', orderController.updateOrderById);
router.put('/cash/method/payment', orderController.cashPaymentMethod);
router.put('/credit/card/method/payment', orderController.creditCardPaymentMethod);
router.put('/confirmPaymentOrderById/:id', orderController.confirmPayOrderById);
router.put('/update/status/pay/by/user', orderController.confirPayOrderByUser);
router.post('/send/invoice/credit/card/pay', orderController.invoicePayOrderCreditCardById);

router.get('/getDiffTime', orderController.getDiffTime);
router.put('/ask/cancel/order/:idOrder', orderController.askCancelOrder);
router.get('/getCancelRequests', orderController.getCancelOrderRequests);

router.put('/confirmCancelOrder/:id', orderController.ConfirmCancelOrder);
router.put('/ConfirmCancelOrderCash/:id', orderController.ConfirmCancelOrderCash);
router.put('/rejectCancelOrder/:id', orderController.RejectCancelOrder);

router.put('/update/order/:idOrder/:productId', orderController.UpdateOrder);
router.put('/update/order/When/payMethod/cash/:idOrder/:productId', orderController.UpdatedOrderMethodPaymentCash);

module.exports = router;
