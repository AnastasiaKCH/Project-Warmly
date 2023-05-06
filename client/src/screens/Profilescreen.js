import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import { Tag } from "antd";

const Profilescreen = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (!user) {
            window.location.href = "/login";
        }
    }, []);

    const items = [
        {
            key: '1',
            label: `Данные профиля`,
            children:
                <div>
                    <h1>Ваши данные профиля:</h1>
                    <br />
                    <p><b>Имя:</b> {user.name}</p>
                    <p><b>Почта:</b> {user.email}</p>
                    <p><b>Телефон:</b> {user.phone}</p><br/>
                </div>,
        },
        {
            key: '2',
            label: `Список брони`,
            children: <Mybookings />,
        }
    ];

    return (
        <div className="tabs">
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    )
};

export default Profilescreen;


export function Mybookings() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [bookings, setbookings] = useState([]);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();

    const myBookedrooms = async () => {
        try {
            const data = await (await axios.post("/api/bookings/getbookingsbyuserid", { userid: user._id })).data;
            setbookings(data);
            setloading(false);
        } catch (error) {
            console.log(error);
            setloading(false);
            seterror(error);
        }
    };

    useEffect(() => { myBookedrooms() });

    async function cancelBooking(bookingid, roomid) {
        try {
            setloading(true);
            const result = await (await axios.post("/api/bookings/cancelbooking", { bookingid, roomid })).data;
            console.log(result);
            setloading(false);
            Swal.fire("Congrats", "Your booking has been cancelled", "success").then(result => {
                window.location.reload();
            })
        } catch (error) {
            console.log(error);
            setloading(false);
            Swal.fire("Oops", "Something went Wrong", "error");
        }
    }

    return (
        <div className="row">
            <div className="col-md-6">
                {loading && (<Loader />)}
                {bookings && (bookings.map(booking => {
                    return (<div className="bs" key={booking._id}>
                        <h1>{booking.room}</h1>
                        <p><b>BookingId</b>: {booking._id}</p>
                        <p><b>CheckIn</b>: {booking.fromdate}</p>
                        <p><b>Checkout</b>: {booking.todate}</p>
                        <p><b>Amount</b>: {booking.totalamount}</p>
                        <p><b>Status</b>: {}
                        {booking.status == "cancelled" ? (<Tag color="orange">CANCELLED</Tag>) : (<Tag color="green">CONFIRMED</Tag>)}</p>
                        {booking.status !== "cancelled" &&
                            (<div className="btn">
                                <button className="btn btn-primary" onClick={() => { cancelBooking(booking._id, booking.roomid) }}>CANCEL BOOKING</button>
                            </div>)}
                    </div>)
                }))}
            </div>
        </div>
    )
};
