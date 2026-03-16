import { useState } from 'react'
import type { Person } from '../../models/Person';
import { useNavigate } from 'react-router-dom';
import type { Role } from '../../models/Role';

function Signup() {
  const navigate = useNavigate();
  const [person, setPerson] = useState<Person>({
      firstName: "",
      lastName: "",
      email: "",
      role: "USER",
      favourites: []
  });

  const signup = async() => {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/signup", {
            method: "POST",
            body: JSON.stringify(person),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const json = await res.json();
        // TODO auto log in
        if (json.id) {
          navigate("/login");
        }

    }

  return (
    <div>
      <h3>Signup</h3>
      <div className="insert-data">
        <div className="field">
          <label>First name</label>
          <input value={person.firstName} onChange={(e) => setPerson({...person, firstName: e.target.value})} type="text" /> <br />
        </div>
        <div className="field">
          <label>Last name</label>
          <input value={person.lastName} onChange={(e) => setPerson({...person, lastName: e.target.value})} type="text" /> <br />
        </div>
        <div className="field">
          <label>Email</label>
          <input value={person.email} onChange={(e) => setPerson({...person, email: e.target.value})} type="text" /> <br />
        </div>
        <div className="field">
          <label>Password</label>
          <input value={person.password} onChange={(e) => setPerson({...person, password: e.target.value})} type="password" /> <br />
        </div>
        <div className="field">
          <label>Role (for testing)</label>
          <select onChange={(e) => setPerson({...person, role: e.target.value.toUpperCase() as Role})}>
            <option>User</option>
            <option>Admin</option>
          </select>
        </div>
        <div className="btn-container" >
          <button onClick={signup}>Sign up</button>
        </div>
      </div>
    </div>
  )
}

export default Signup