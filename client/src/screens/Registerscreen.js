import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import ReCAPTCHA from "react-google-recaptcha";

const Registerscreen = () => {
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [phone, setphone] = useState("");
    const [password, setpassword] = useState("");
    const [cpassword, setcpassword] = useState("");
    const [captcha, setcaptcha] = useState(false);
    const [verified, setVerified] = useState(false);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    const [success, setsuccess] = useState();

    const [nameDirty, setNameDirty] = useState(false);
    const [emailDirty, setEmailDirty] = useState(false);
    const [phoneDirty, setPhoneDirty] = useState(false);
    const [passwordDirty, setPasswordDirty] = useState(false);
    const [cpasswordDirty, setCpasswordDirty] = useState(false);

    const [nameError, setNameError] = useState("Это поле не может быть пустым");
    const [emailError, setEmailError] = useState("Это поле не может быть пустым");
    const [phoneError, setPhoneError] = useState("Это поле не может быть пустым");
    const [passwordError, setPasswordError] = useState("Это поле не может быть пустым");
    const [cpasswordError, setCpasswordError] = useState("Это поле не может быть пустым");

    useEffect(() => {
        if ((nameError || emailError || phoneError || passwordError || cpasswordError) && (password !== cpassword) && (captcha === false)) {
            setVerified(false);
        } else {
            setVerified(true);
        }
    }, [nameError, emailError, phoneError, passwordError, cpasswordError]);

    const blurHandler = (e) => {
        switch (e.target.name) {
            case "name":
                setNameDirty(true);
                break;
            case "email":
                setEmailDirty(true);
                break;
            case "phone":
                setPhoneDirty(true);
                break;
            case "password":
                setPasswordDirty(true);
                break;
            case "cpassword":
                setCpasswordDirty(true);
                break;
        }
    };

    const nameHandler = (e) => {
        setname(e);
        if (e === "") {
            setNameError("Это поле не может быть пустым");
        } else {
            setNameError("");
            setNameDirty(false);
        }
    };

    const emailHandler = (e) => {
        setemail(e);
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(e)) {
            setEmailError("Проверьте заполненность поля по форме xxx@yyy.zzz");
        } else {
            setEmailError("");
            setEmailDirty(false);
        }
    };

    const phoneHandler = (e) => {
        setphone(e);
        const re = /^(\+7|7)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        if (!re.test(String(e).toLowerCase())) {
            setPhoneError("Некорректно указан номер телефона, должно начинаться с +7... и содержать 11 цифр");
        } else {
            setPhoneError("");
            setPhoneDirty(false);
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
        if (e === "") {
            setCpasswordError("Это поле не может быть пустым");
        } else {
            setCpasswordError("");
            setCpasswordDirty(false);
        }

    };

    function onChange(value) {
        console.log("Captcha value:", value);
        setcaptcha(true);
    }

    async function register(e) {
        e.preventDefault();

        if (password == cpassword) {
            const user = {
                name,
                email,
                phone,
                password,
                code: "0000"
            };

            try {
                setloading(true);
                const result = await axios.post("/api/users/register", user);
                const record = result.data;
                console.log(record.statusText);
                if (record.statusText == "Unsuccess") {
                    setloading(false);
                    seterror(true);
                } else {
                    setloading(false);
                    setsuccess(true);
                    window.location.href = "/success";
                }
            } catch (error) {
                setloading(false);
                seterror(true);
            }
        }
    }

    return (
        <div>
            {loading && (<Loader />)}
            <div className="row justify-content-center mt-5">
                <form className="col-md-5">
                    {error && (<div><Error message="Пользователь с такой почтой уже существует. Для восстановления пароля перейдите по ссылке внизу" /><a href="/forgot">Забыли пароль?</a></div>)}
                    <h2>Регистрация</h2>
                    <div className="checkname">
                        <label><b>Имя:</b></label>
                        <input type="text" className={(nameDirty && nameError) ? "wrong" : "correct"} value={name} name="name" placeholder="имя" onBlur={e => blurHandler(e)} onChange={(e) => { nameHandler(e.target.value) }} />
                        {(nameDirty && nameError) && <div className="check">{nameError}</div>}<br />
                    </div>
                    <div className="checkemail">
                        <label><b>Электронная почта:</b></label>
                        <input type="text" className={(emailDirty && emailError) ? "wrong" : "correct"} value={email} name="email" placeholder="почта" onBlur={e => blurHandler(e)} onChange={(e) => { emailHandler(e.target.value) }} />
                        {(emailDirty && emailError) && <div className="check">{emailError}</div>}<br />
                    </div>
                    <div className="checkphone">
                        <label><b>Номер телефона:</b></label>
                        <input type="tel" className={(phoneDirty && phoneError) ? "wrong" : "correct"} value={phone} name="phone" placeholder="номер телефона" onBlur={e => blurHandler(e)} onChange={(e) => { phoneHandler(e.target.value) }} />
                        {(phoneDirty && phoneError) && <div className="check">{phoneError}</div>}<br />
                    </div>
                    <div className="checkpassword">
                        <label><b>Пароль:</b></label>
                        <input type="text" className={(passwordDirty && passwordError) ? "wrong" : "correct"} value={password} name="password" placeholder="пароль" onBlur={e => blurHandler(e)} onChange={(e) => { passwordHandler(e.target.value) }} />
                        {(passwordDirty && passwordError) && <div className="check">{passwordError}</div>}<br />
                    </div>
                    <div className="checkcpassword">
                        <label><b>Повторите пароль:</b></label>
                        < input type="text" className={(cpasswordDirty && (password !== cpassword)) ? "wrong" : "correct"} value={cpassword} name="cpassword" placeholder="повторите пароль" onBlur={e => blurHandler(e)} onChange={(e) => { cpasswordHandler(e.target.value) }} />
                        {(password !== cpassword) && <div className="check">Пароли не совпадают, повторите попытку</div>}<br /><br />
                        {(cpasswordDirty && cpasswordError) && <div className="check">{cpasswordError}</div>}
                    </div>
                    <ReCAPTCHA sitekey="6LeQG4ElAAAAABJag-1zKBWRAAoQTO4zBqPmmZLa" onChange={onChange} />
                    <button className="btn btn-primary mt-3" onClick={register} disabled={!verified}>Зарегистрироваться</button><br />
                </form>
            </div>
        </div>
    )
};

export default Registerscreen;
