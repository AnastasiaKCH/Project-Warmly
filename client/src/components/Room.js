import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";

const Room = ({ room, fromdate, todate }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const user = JSON.parse(localStorage.getItem("currentUser"));

    return (
        <div className="row bs">
            
            <div className="col-md-4">
                <img src={room.imageurls[0]} className="smallimg" />
            </div>

            <div className="col-md-7 text-left">
                
                <h1>{room.name}</h1>
                <p>{room.brefdescription}</p>
                <p>{room.address}</p>
                <b>
                    <p>Кол-во человек : {room.maxcount}</p>
                    <p>Номер телефона : {room.phonenumber}</p>
                    <p>Площадь: {room.square} кв.м</p>
                    <p>Цена за ночь: {room.rentperday} руб./чел.</p>
                </b>

                <div className="btn-main">

                    {(fromdate && todate) && (
                        <Link to={`/book/${room._id}/${fromdate}/${todate}`}>
                            <button className="btn btn-primary">Бронировать сейчас</button>
                        </Link>
                    )}
                    <button className="btn btn-primary" onClick={handleShow}>Подробнее</button>
                </div>

            </div>

            <Modal show={show} onHide={handleClose} size="lg">

                <Modal.Header>
                    <Modal.Title>{room.name}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Carousel prevLabel="" nextLabel="">
                        {room.imageurls.map(url => {
                            return (<Carousel.Item key={url}>
                                <img
                                    className="d-block w-100 bigimg"
                                    src={url}
                                />
                            </Carousel.Item>)
                        })}
                    </Carousel>
                    <br />
                    <p><b>Цена:</b> {room.rentperday} руб./чел.</p>
                    <p><b>Площадь:</b> {room.square} кв.м</p>
                    <p><b>Адрес:</b> {room.address}</p>
                    <p><b>Преимущества:</b> {room.pluses}</p>
                    <p><b>Описание:</b> {room.description}</p>
                </Modal.Body>

                <Modal.Footer>
                    {user ? (<>
                        <Button variant="secondary" onClick={handleClose}>
                            Написать сообщение арендодателю
                        </Button>
                    </>) : (<><div className="linktologin">
                        <p>Для того что бы написать сообщения арендодателю <a className="link" href="/login">авторизуйтесь</a></p>
                    </div></>)}
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>

            </Modal>
        </div>
    )
};

export default Room;
