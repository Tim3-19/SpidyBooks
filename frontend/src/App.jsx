import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Navbar from './componenets/Navbar/Navbar'
import Footer from './componenets/Footer/Footer'
import AllBooks from './pages/AllBooks'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import Cart from './pages/Cart'
import BookDetails from './componenets/ViewDetails/BookDetails'
import Profile from './pages/Profile'
import Favourite from './componenets/Profile/Favourite'
import UserOrderHistory from './componenets/Profile/UserOrderHistory'
import Settings from './componenets/Profile/Settings'

const App = () => {
  return (
   <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/view-book-details/:id" element={<BookDetails />} />

        <Route path="/profile" element={<Profile />}>
          <Route index element={<Favourite />} />
          <Route path="orderHistory" element={<UserOrderHistory />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      <Footer />
    </> 
  )
}

export default App
