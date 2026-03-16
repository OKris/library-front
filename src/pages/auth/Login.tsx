import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function Login() {
    const {login} = useContext(AuthContext);
    const [loginCredentials, setLoginCredentials] = useState({"email": "", "password": ""});
    
    const handleLogin = async () => {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/login",{
            method: "POST",
            body: JSON.stringify(loginCredentials),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const json = await res.json();
        sessionStorage.setItem("token", json.token);
        if (json.message && json.status && json.timestamp) {
            alert(json.message);
            return;
        }
        login(json.token);
    }

  return (
    <div>
        <h3>Log in</h3>
        <div className="insert-data">
            <div className="field">
                <label>Email</label>
                <input onChange={(e) => setLoginCredentials({...loginCredentials, email: e.target.value})} type="text" /> <br />
            </div>
            <div className="field">
                <label>Password</label>
                <input onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})} type="password" /> <br />
            </div>
            <div className="btn-container" >
                <button onClick={handleLogin}>Log in</button>
            </div>
        </div>
    </div>
  )
}

export default Login