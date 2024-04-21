import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate
} from "react-router-dom";
import Navbar from "./components/common/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./styles/main.css"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ArtsCollection from "./pages/ArtsCollection";
import ArtDetail from "./pages/ArtDetail";
import Create from "./pages/arts/Create";
import CreateCat from "./pages/category/Create";
import List from "./pages/arts/List";
import ListCat from "./pages/category/List";

import Edit from "./pages/arts/Edit";
import EditCat from "./pages/category/Edit";

import PaymentDetails from "./pages/PaymentDetails";
import PrivateRoute from "./components/common/Routes/PrivateRoute";
import { getLoggedUser, isLoggedIn } from "./helpers/auth";
import BidDetails from "./pages/BidDetails";
import UserPreferences from "./pages/UserPreferences";
import NotFound from "./pages/NotFound";
import View from "./pages/user/View";
import './components/auth/interceptor'
import PaymentSuccessful from "./pages/PaymentSuccessful";
import Footer from "./pages/Footer";

function App() {


  return (
   
      <>
      <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />}/>
          <Route exact path="/register" element={<Register />}/>
          <Route exact path="/browse-arts" element={<ArtsCollection />}/>
          <Route path="/art-detail/:id" element={<ArtDetail />}/>

          <Route exact path='/' element={<PrivateRoute/>}>
            <Route path="/arts/create" element={<Create/>}/>
          </Route>

          {/* <Route exact path='/' element={<PrivateRoute/>}>
          </Route> */}
          <Route exact path='/' element={<PrivateRoute/>}>
            <Route path="/arts/view" element={<List />}/>
          </Route>

          <Route exact path='/' element={<PrivateRoute/>}>
            <Route path="/arts/edit" element={<Edit />}/>
          </Route>

          <Route exact path='/' element={<PrivateRoute/>}>
            <Route path="/payment-details" element={<PaymentDetails />}/>
          </Route>

          <Route exact path='/' element={<PrivateRoute/>}>
            <Route path="/payment-successful" element={<PaymentSuccessful />}/>
          </Route>
          <Route path="/category" element={<ListCat />}/>
          <Route exact path='/' element={<PrivateRoute/>}>
            <Route path="/category/create" element={<CreateCat />} />
          </Route>
          <Route exact path='/' element={<PrivateRoute/>}>
            <Route path="/category/edit" element={<EditCat />} />
          </Route>
          <Route exact path='/' element={<PrivateRoute/>}>
            <Route path="/bid-details" element={<BidDetails />} />
          </Route>
          <Route exact path='/' element={<PrivateRoute/>}>
            <Route path="/user/preferences" element={<UserPreferences />} />
          </Route>

          <Route exact path='/' element={<PrivateRoute/>}>
            <Route path="/user/view" element={<View />}/>
          </Route>

          <Route path='*' element={<NotFound />} />

       </Routes>  
       </>
   
  );
}

export default App;
