import React from "react";

const RegisterSuccessScreen = () => {
  return (
    <div className="success-message">
      <p><b>Регистрация прошла успешно!</b><br />Для полноценного использования сайта <a className="gotoautorisation" href="/login">авторизуйтесь</a>.</p>
    </div>
  )
};

export default RegisterSuccessScreen;
