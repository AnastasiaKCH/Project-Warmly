import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room.js";
import Loader from "../components/Loader";
import { DatePicker} from "antd";
import moment from "moment";
import ReactSlider from "react-slider";

const { RangePicker } = DatePicker;

const Homescreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setloading] = useState();
  const [error, seterror] = useState();

  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [duplicate, setduplicate] = useState([]);

  const [searchkey, setsearchkey] = useState("");
  const [type, settype] = useState("all");

  const [price, setprice] = useState([1, 10000]);

  useEffect(() => {
    async function fetchData() {
      try {
        setloading(true);
        const data = (await axios.get("/api/rooms/getallrooms")).data;
        setRooms(data);
        setduplicate(data);
        setloading(false);
      } catch (error) {
        seterror(true);
        console.log(error);
        setloading(false);
      }
    }
    fetchData()
  }, []);

  function filterByDate(dates) {
    setfromdate(dates[0].format("DD-MM-YYYY"));
    settodate(dates[1].format("DD-MM-YYYY"));

    let temprooms = [];

    for (const room of duplicate) {
      let availability = false;
      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          if (!moment(moment(dates[0]).format("DD-MM-YYYY")).isBetween(booking.fromdate, booking.todate) && !moment(moment(dates[1]).format("DD-MM-YYYY")).isBetween(booking.fromdate, booking.todate)) {
            if (dates[0].format("DD-MM-YYYY") !== booking.fromdate &&
              dates[1].format("DD-MM-YYYY") !== booking.todate &&
              dates[0].format("DD-MM-YYYY") !== booking.todate &&
              dates[1].format("DD-MM-YYYY") !== booking.fromdate) {
              availability = true;
            }
          }
        }
      } else {
        availability = true;
      }
      if (availability == true) {
        temprooms.push(room);
      }
    }
    setRooms(temprooms);
  }

  function filterBySearch() {
    const temprooms = duplicate.filter(room => room.name.toLowerCase().includes(searchkey.toLowerCase()));
    setRooms(temprooms);
  }

  function filterByType(e) {
    settype(e);
    if (e !== "all") {
      const temprooms = duplicate.filter(room => room.type.toLowerCase() == e.toLowerCase());
      setRooms(temprooms);
    } else {
      setRooms(duplicate);
    }
  }

  function filterByPrice(priceRange) {
    setprice(priceRange);
    const [minPrice, maxPrice] = priceRange;
    const temprooms = duplicate.filter(room => room.rentperday >= minPrice && room.rentperday <= maxPrice);
    setRooms(temprooms);
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>

        <div className="col-md-5">
          <input type="text" className="form control" placeholder="поиск по названию" value={searchkey} onChange={(e) => { setsearchkey(e.target.value) }} onKeyUp={filterBySearch} />
        </div>

        <div className="col-md-3">
          <select className="form control" value={type} onChange={(e) => { filterByType(e.target.value) }}>
            <option value="all">Все варианты</option>
            <option value="hotel room">Гостиничный номер</option>
            <option value="flat">Квартира</option>
            <option value="guest room">Комната</option>
          </select>
        </div>

        <div className="col-md-3 mt-5 mb-5">
          <div className="px-5">
            <p>Поиск по цене:</p>
            <ReactSlider className="customSlider"
              trackClassName="customSlider-track"
              thumbClassName="customSlider-thumb"
              min={1}
              max={10000}
              defaultValue={[1, 10000]}
              value={price}
              renderThumb={(props, state) => <div className="price-text" {...props} >{state.valueNow}</div>}
              onChange={filterByPrice} />
          </div>
        </div>

      </div>
      <div className="row justify-content-center mt-5">
        {loading ? (<Loader />) : (rooms.map((room) => {
          return <div key={room._id} className="col-md-9 mt-3">
            <Room room={room} fromdate={fromdate} todate={todate} />
          </div>;
        }))}
      </div>
    </div>
  )
};

export default Homescreen;

