const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');


const { v4: uuidv4 } = require('uuid');
const Profile = require('../../models/Profile');
const stripe = require("stripe")("sk_test_51IxblRCgLuW51TZUo6fbYvM3qrGqsLKWcskZ92qXQNCoQqrSpYEWatE843Hm3v0J6cgibS42qyvBdYb1CWM21Ujh00uN2dF7aB");


// @route    GET api/auth
// @desc     Get Stripe Key
// @access   Private
router.get('/', auth, async (req, res) => {

});



// @route    POST api/auth
// @desc     Do Payment
// @access   Private
router.post('/checkout', async (req, res) => {

    let error;
    let status;

    try {
        const { product, token } = req.body;

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        const itemPotencykey = uuidv4();

        const details = {
            amount: product.price * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: `Session Hired: ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                }
            }
        };

        await stripe.charges.create(details
            , function (error) {
                if (error)
                    status = "failure"
                else
                    status = "success"
            }
        );
        status = "success";
    }
    catch (error) {
        console.error("Error: ", error);
        status = "failure";
    }

    res.json({ error, status });
}
);



// @route    POST api/payment
// @desc     Update Session Booking Status on booking
// @access   Private
router.post('/updateBookingStatus/:id', auth, async (req, res) => {

    const { sessionId } = req.body;
    var profile;
    try {

        profile = await Profile.findOneAndUpdate({ 'session._id': sessionId }, {
            '$set': {
                'session.$.status': 'booked'
            }

        }, function (err) {
            console.log(err);
        })
    }
    catch (err) {
        console.log(err)
    }
    finally {

        var sendAvaibleOnly = [];
        var j = 0;
        for (var i = 0; i < profile.session.length; i++) {
            if (profile.session[i].status === "available") {
                sendAvaibleOnly[j] = profile.session[i];
                j = j + 1;
            }
        }
        res.json(sendAvaibleOnly);
    }

});


// @route    POST api/payment
// @desc     Update Session Booking Status on booking
// @access   Private
router.post('/client/:id', auth, async (req, res) => {

    const { name, email, phNo } = req.body;

    try {

        await Profile.findOneAndUpdate({ 'session._id': req.params.id }, {
            '$set': {
                'session.$.bookedByName': name,
                'session.$.bookedByEmail': email,
                'session.$.bookedByPhNo': phNo
            }

        }, function (err) {
            console.log(err);
        })
    }
    catch (err) {
        console.log(err)
    }
});



module.exports = router;
