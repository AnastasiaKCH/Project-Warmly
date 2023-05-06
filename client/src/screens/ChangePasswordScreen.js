import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

const ChangePasswordScreen = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [cpassword, setcpassword] = useState("");
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    const [emailDirty, setEmailDirty] = useState(false);
    const [passwordDirty, setPasswordDirty] = useState(false);
    const [cpasswordDirty, setCpasswordDirty] = useState(false);
    const [emailError, setEmailError] = useState("Это поле не может быть пустым");
    const [passwordError, setPasswordError] = useState("Это поле не может быть пустым");
    const [cpasswordError, setCpasswordError] = useState("Это поле не может быть пустым");

    const blurHandler = (e) => {
        switch (e.target.name) {
            case "email":
                setEmailDirty(true);
                break;
            case "password":
                setPasswordDirty(true);
                break;
            case "cpassword":
                setCpasswordDirty(true);
                break;
        }
    };

    const emailHandler = (e) => {
        setemail(e);
        if (e === "") {
            setEmailError("Это поле не может быть пустым");
        } else {
            setEmailError("");
            setEmailDirty(false);
        }
    };

    const passwordHandler = (e) => {
        setpassword(e);
        if (e.length < 8) {
            setPasswordError("Пароль должен быть не менее 8 символов");
        } else {
            setPasswordError("");
            setPasswordDirty(false);
        }
    };

    const cpasswordHandler = (e) => {
        setcpassword(e);
        setCpasswordError("");
        setCpasswordDirty(false);
    };

    async function sendLink(e) {
        e.preventDefault();
        if (((emailError && passwordError && cpasswordError) == "") && (password == cpassword)) {
            try {
                setloading(true);
                const res = await axios.post("/api/users/createpassword", { password, email }).data;
                setloading(false);
                window.location.href = "/success_change";
            } catch (error) {
                setloading(false);
                seterror(true);
            }
        }
    }

    return (
        <div className="row justify-content-center mt-5">
            {loading && (<Loader />)}
            <form className="col-md-5">
                {error && (<Error message="Неверный код" />)}
                <div className="bs">
                    <h2>Изменить пароль</h2>
                    <div className="checkemail">
                        <label><b>Электронная почта:</b></label>
                        <input type="text" className="form-control" placeholder="почта" value={email} name="email" onBlur={e => blurHandler(e)} onChange={(e) => { emailHandler(e.target.value) }} />
                        {(emailDirty && emailError) && <div className="check">{emailError}</div>}
                    </div>
                    <div className="newpassword">
                        <label><b>Новый пароль</b></label>
                        <input type="text" className="form-control" placeholder="новый пароль" value={password} name="password" onBlur={e => blurHandler(e)} onChange={(e) => { passwordHandler(e.target.value) }} />
                        {(passwordDirty && passwordError) && <div className="check">{passwordError}</div>}
                    </div>
                    <div className="confnewpassword">
                        <label><b>Подтверждение пароля</b></label>
                        <input type="text" className="form-control" placeholder="подтвердите пароль" value={cpassword} name="cpassword" onBlur={e => blurHandler(e)} onChange={(e) => { cpasswordHandler(e.target.value) }} />
                        {(password !== cpassword) && <div className="check">Пароли не совпадают, повторите попытку</div>}
                        {(cpasswordDirty && cpasswordError) && <div className="check">{cpasswordError}</div>}
                    </div>
                    <button className="btn btn-primary mt-3" onClick={sendLink}>Сменить пароль</button>
                </div>
            </form>
        </div>
    )
};

export default ChangePasswordScreen;
