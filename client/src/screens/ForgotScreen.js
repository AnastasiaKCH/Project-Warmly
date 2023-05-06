import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

const ForgotScreen = () => {
    const [email, setEmail] = useState("");
    const [verified, setVerified] = useState(false);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);

    function onChange(value) {
        console.log("Captcha value:", value);
        setVerified(true);
    };

    function setVal(e) {
        setEmail(e.target.value);
    }

    async function sendLink(e) {
        e.preventDefault();

        try {
            setloading(true);
            const res = await axios.post("/api/users/sendpasswordlink", { email });
            const record = res.data;
            if (record.statusText == "Unsuccess") {
                setloading(false);
                seterror(true);
                setEmail("");
            } else {
                setloading(false);
            }
        } catch (error) {
            setloading(false);
            seterror(true);
            setEmail("");
        }
    }

    return (
        <div>
            {loading && (<Loader />)}
            <div className="row justify-content-center mt-5">
                <form className="col-md-5">
                    {error && (<Error message="Такая почта не зарегистрирована!" />)}
                    <div className="bs">
                        <h2>Для восстановления пароля укажите Вашу электронную почту</h2>
                        <label><b>Электронная почта:</b></label>
                        <input type="text" className="form-control" placeholder="почта" onChange={setVal} value={email} /><br />
                        <ReCAPTCHA sitekey="6LeQG4ElAAAAABJag-1zKBWRAAoQTO4zBqPmmZLa" onChange={onChange} />
                        <button className="btn btn-primary mt-3" onClick={sendLink} disabled={!verified}>Отправить письмо с кодом</button><br />
                    </div>
                </form>
            </div>
        </div>
    )
};

export default ForgotScreen;
