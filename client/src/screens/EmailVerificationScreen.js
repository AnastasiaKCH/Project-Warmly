import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

const EmailVerificationScreen = () => {
    const [number1, setNumber1] = useState("");
    const [number2, setNumber2] = useState("");
    const [number3, setNumber3] = useState("");
    const [number4, setNumber4] = useState("");
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);

    async function numberHandler(e) {
        e.preventDefault();
        let numbs = [];
        let number = "";

        if ((number1 && number2 && number3 && number4) !== "") {
            numbs = [number1, number2, number3, number4];
            console.log(numbs);
            number = numbs.join("");
            console.log(number);
        }

        try {
            setloading(true);
            const result = await axios.post("/api/users/confirmcode", { number });
            const record = result.data;
            if (record.statusText == "Unsuccess") {
                setloading(false);
                seterror(true);
            } else {
                setloading(false);
                window.location.href = "/newpassword";
            }
        } catch (error) {
            setloading(false);
            seterror(true);
        }
    }

    return (
        <div className="row justify-content-center mt-5">
            {loading && (<Loader />)}
            <form className="col-md-5">
                {error && (<Error message="Неверный код" />)}
                <div className="bs verification">
                    <h2>Подтверждение почты:</h2>
                    <p>Вам было направлено письмо на почту. Укажите код из письма:</p>
                    <div className="maincodeNumber">
                        <input className="codeNumber" type="text" value={number1} name="number" onChange={(e) => { (setNumber1(e.target.value)) }}></input>
                        <input className="codeNumber" type="text" value={number2} name="number" onChange={(e) => { (setNumber2(e.target.value)) }}></input>
                        <input className="codeNumber" type="text" value={number3} name="number" onChange={(e) => { (setNumber3(e.target.value)) }}></input>
                        <input className="codeNumber" type="text" value={number4} name="number" onChange={(e) => { (setNumber4(e.target.value)) }}></input>
                    </div>
                    <button className="btn btn-primary mt-3" onClick={numberHandler} >Подтвердить почту</button>
                    <br />
                </div>
            </form>
        </div>
    )
};

export default EmailVerificationScreen;
