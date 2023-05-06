import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";

const BookingScreen = ({ match }) => {
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();
    const [room, setroom] = useState();

    let { roomid, fromdate, todate } = useParams();
    const firstdate = moment(fromdate, "DD-MM-YYYY");
    const lastdate = moment(todate, "DD-MM-YYYY");
    const totaldays = moment.duration(lastdate.diff(firstdate)).asDays() + 1;
    const [totalamount, settotalamount] = useState();

    useEffect(() => {
        if (!localStorage.getItem("currentUser")) {
            window.location.href = "/login";
        }

        async function fetchData() {
            try {
                setloading(true);
                const data = (await axios.post("/api/rooms/getroombyid", { roomid: roomid })).data;
                settotalamount(data.rentperday * totaldays);
                setroom(data);
                setloading(false);
            } catch (error) {
                seterror(true);
                console.log(error);
                setloading(false);
            }
        }
        fetchData();
    }, []);

    async function onToken(token) {
        console.log(token);

        const bookingDetails = {
            room,
            userid: JSON.parse(localStorage.getItem("currentUser"))._id,
            fromdate,
            todate,
            totalamount,
            totaldays,
            token
        };

        try {
            setloading(true);
            const result = await axios.post("/api/bookings/bookroom", bookingDetails, token);
            setloading(false);
            Swal.fire("Congratulations", "Your Room Booked successfully", "success").then(result => window.location.href = "/profile");
        } catch (error) {
            setloading(false);
            Swal.fire("Oops", "Something went wrong", "error");
        }
    }

    return (
        <div className="m-5">
            {loading ? (<Loader />) : room ? (<div>
                <div className="row justify-content-center mt-5 bs">
                    <div className="col-md-8">
                        <h1>{room.name}</h1>
                        <img src={room.imageurls[0]} className="bigimg" />
                    </div>
                    <div className="roomdescr">
                        <div>
                            <h1>Booking Details</h1>
                            <hr className="line" />
                            <strong>
                                <p>Name: {JSON.parse(localStorage.getItem("currentUser")).name}</p>
                                <p>From Date: {fromdate}</p>
                                <p>To Date: {todate}</p>
                                <p>Max Count: {room.maxcount}</p>
                            </strong>
                        </div>

                        <div >
                            <strong>
                                <h1>Amount</h1>
                                <hr className="line" />
                                <p>Total days: {totaldays}</p>
                                <p>Rent per day: {room.rentperday}</p>
                                <p>Total Amount: {totalamount}</p>
                            </strong>
                        </div>

                        <div className="btn-main">
                            <StripeCheckout
                                amount={totalamount * 100}
                                token={onToken}
                                currency="RUB"
                                stripeKey="pk_test_51Mstx1IpzZwOy62iLZJ6NZ37D2dMp8CaPvtDo7SszH1up4mDiAAq85r5nEQwS2aZmo1mUBcmmLI1fshhxgBa9rLG00RtYZmM00">
                                <button className="btn btn-primary">Оплатить</button>
                            </StripeCheckout>
                        </div>
                    </div>
                </div>
            </div>) : (<Error />)}
        </div>
    )
};

export default BookingScreen;
