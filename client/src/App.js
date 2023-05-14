import './App.css';
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import BookingScreen from "./screens/BookingScreen";
import Registerscreen from "./screens/Registerscreen";
import Loginscreen from "./screens/Loginscreen";
import Profilescreen from "./screens/Profilescreen";
import Landingscreen from "./screens/Landingscreen";
import RegisterSuccessScreen from "./screens/RegisterSuccessScreen";
import ForgotScreen from "./screens/ForgotScreen";
import EmailVerificationScreen from "./screens/EmailVerificationScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import SuccessChangeScreen from "./screens/SuccessChangeScreen";

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Homescreen />} />
          <Route path="/book/:roomid/:fromdate/:todate" element={<BookingScreen />} />
          <Route path="/register" element={<Registerscreen />} />
          <Route path="/login" element={<Loginscreen />} />
          <Route path="/profile" element={<Profilescreen />} />
          <Route path="/" element={<Landingscreen />} />
          <Route path="/success" element={<RegisterSuccessScreen />} />
          <Route path="/forgot" element={<ForgotScreen/>}/>
          <Route path="/code" element={<EmailVerificationScreen/>}/>
          <Route path="/newpassword" element={<ChangePasswordScreen/>}/>
          <Route path="/success_change" element={<SuccessChangeScreen/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
