import React from 'react'
import LoginPage from './Pages/Login'
import CreateAccount from './Pages/CreateAccount'
import NavBar from './components/NavBar'
import Login from './Pages/Login'


const App = () => {
  return (
    <div className= 'container'>
      <NavBar/>
       <CreateAccount/>
      {/* <Login/> */}
    </div>
  )
}
export default App
