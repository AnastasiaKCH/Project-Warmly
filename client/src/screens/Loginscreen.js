import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { Link } from "react-router-dom";

const Loginscreen = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();

    async function login() {
        const user = {
            email,
            password
        };

        try {
            setloading(true);
            const result = (await axios.post("/api/users/login", user)).data;
            setloading(false);
            localStorage.setItem("currentUser", JSON.stringify(result));
            window.location.href = "/profile";
        } catch (error) {
            console.log(error);
            setloading(false);
            seterror(true);
        }
    }

    return (
        <div>
            {loading && (<Loader />)}
            <div className="row justify-content-center mt-5">
                <div className="col-md-5">
                    {error && (<Error message="Invalid Credentionals" />)}
                    <div className="bs">
                        <h2>Войти в профиль</h2>
                        <label><b>Электронная почта:</b></label>
                        <input type="text" className="form-control" placeholder="почта" value={email} onChange={(e) => { setemail(e.target.value) }} /><br />
                        <label><b>Пароль:</b></label>
                        <input type="text" className="form-control" placeholder="пароль" value={password} onChange={(e) => { setpassword(e.target.value) }} />
                        <button className="btn btn-primary mt-3" onClick={login}>Войти</button>
                        <div className="linktoforgot">
                            <Link to="/forgot">
                                <p>Забыли пароль?</p>
                            </Link>
                        </div>
                        <div className="noaccount">
                            <p>Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};

export default Loginscreen;

