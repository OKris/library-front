import './App.css'
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import DetailedView from './pages/DetailedView';
import Menu from './components/Menu';
import Profile from './pages/auth/Profile';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import AddBook from './pages/admin/AddBook';
import EditBook from './pages/admin/EditBook';

function App() {

  return (
    <>
      <div>
        <Menu />

        <Routes>
          <Route path='/' element={ <HomePage /> } />
          <Route path='/book/:book_id' element={ <DetailedView /> } />
          
            <Route path='/admin/add-book' element={ <AddBook /> } />
            <Route path='/admin/edit-book/:book_id' element={ <EditBook /> } />


          <Route path='/login' element={ <Login /> } />
          <Route path='/signup' element={ <Signup /> } />
          <Route path='/profile' element={ <Profile /> } />
        </Routes>
      </div>
    </>
  )
}

export default App
