import React from "react";

function Navbar() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    function logout() {
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
    }
    return (
        <div>
            <nav class="navbar navbar-expand-lg">
                <a class="navbar-brand" href="/home">Warmly<br /><p class="navbar-descrip"> бронирование жилья в Санкт-Петербурге</p></a>

                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"><i class="fa fa-bars" style={{ color: "white" }}></i></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        {user ? (<><div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa fa-user"></i>  {user.name}
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <a class="dropdown-item" href="/profile">Личный кабинет</a>
                                <a class="dropdown-item" href="#" onClick={logout}>Выйти</a>
                            </ul>
                        </div>
                        </>) : (<><li class="nav-item">
                            <a class="nav-link" href="/register">Регистрация</a>
                        </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/login">Вход</a>
                            </li></>)}
                        <a class="nav-link-main" href="/home">Главная</a>
                    </ul>
                </div>
            </nav >
        </div >
    );
}

export default Navbar;