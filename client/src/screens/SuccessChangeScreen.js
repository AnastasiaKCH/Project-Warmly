import React from "react";

const ChangeSuccessScreen = () => {
  return (
    <div className="success-message">
      <p><b>Пароль восстановлен успешно!</b><br />Чтобы забронировать квартиру необходимо <a className="gotoautorisation" href="/login">авторизоваться</a>.</p>
    </div>
  )
};

export default ChangeSuccessScreen;
