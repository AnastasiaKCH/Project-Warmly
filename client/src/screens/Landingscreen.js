import React from "react";
import { Link } from "react-router-dom";

const Landingscreen = () => {
    return (
        <div className="row landing">
            <div className="col-md-12 text-center pouranim">
                <h2 className="text1">Warmly</h2>
                <h1 className="text2">"Лучшие воспоминания начинаются здесь"</h1>
                <Link to="/home">
                    <button className="btn-landing">Начать поиск</button>
                </Link>
            </div>
        </div>
    )
};

export default Landingscreen;
