const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const stripe = require("stripe")("sk_test_51Mstx1IpzZwOy62ijStGXJlolGz2PT4ckgGF2MZ6WAGFvi0EM6EQa6N9PJbKhspTLkxyvJEscIneYh14HrIyyYnf00syVaNrAC");

router.post("/bookroom", async (req, res) => {
    const { room,
        userid,
        fromdate,
        todate,
        totalamount,
        totaldays,
        token
    } = req.body;

    try {
        const customer = await stripe.customers.create({ email: token.email, source: token.id });
        const payment = await stripe.charges.create(
            {
                amount: totalamount * 100,
                customer: customer.id,
                currency: "RUB",
                receipt_email: token.email
            }, {
            idempotencyKey: uuidv4()
        })

        if (payment) {
            const newbooking = new Booking({
                room: room.name,
                roomid: room._id,
                userid,
                fromdate: fromdate,
                todate: todate,
                totalamount,
                totaldays,
                transactionId: "1234"
            });
            const booking = await newbooking.save();
            const roomtemp = await Room.findOne({ _id: room._id });
            roomtemp.currentbookings.push({
                bookingid: booking._id,
                fromdate: fromdate,
                todate: todate,
                userid: userid,
                status: booking.status
            });
            await roomtemp.save();
        }
        res.send("Payment Successfull, Your Room is booked");
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/getbookingsbyuserid", async (req, res) => {
    const userid = req.body.userid;
    try {
        const bookings = await Booking.find({ userid: userid });
        res.send(bookings);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/cancelbooking", async (req, res) => {
    const { bookingid, roomid } = req.body;
    try {
        const bookingitem = await Booking.findOne({ _id: bookingid });
        bookingitem.status = "cancelled";
        await bookingitem.save();
        const room = await Room.findOne({ _id: roomid });
        const bookings = room.currentbookings;
        const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid);
        room.currentbookings = temp;
        await room.save();
        res.send("Your booking cancelled successfully");
    } catch (error) {
        return res.status(400).json({ error });
    }
});

module.exports = router;