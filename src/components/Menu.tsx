import { useContext } from 'react'
import { Link } from 'react-router-dom';
import './Menu.css'
import { AuthContext } from "../context/AuthContext";

function Menu() {
  const {person, isLoggedIn, logout} = useContext(AuthContext);

  const logoutHandler = () => {
    logout();
  }

  return (
    <div className='menu-container'>
      <div className='menu-bar'>

        <Link to="/">
            <button>Home</button>
        </Link>

        {isLoggedIn ?
          <>

            {person.role == "ADMIN" ?
              <>
                <Link to="/admin/add-book">
                  <button>Add book</button>
                </Link>
              </> :
              <></>
            }

            <Link to="/profile">
              <button>Profile</button>
            </Link>

            <button onClick={logoutHandler}>Log out</button>
            <br />
            <span className="name">HI, {person.firstName}</span>
          </> :
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>

            <Link to="/signup">
              <button>Signup</button>
            </Link>
          </>

        }
      </div>
    </div>
  )
}

export default Menu