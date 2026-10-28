import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import Domain from './Domain'
import Feedback from './Feedback'
import Nav from './Nav'
import Footer from './Footer'
import Java from './Java'
import Python from './Python'
import Login from './Login'
// import Signin from './Signin'
import Mern from './Mern'
import MEAN from './Mean'
import Aws from './Aws'
import DataAnalytics from './DataAnalytics'
import DataScience from './DataScience'


const App = () => {
  return (
   <>
   <BrowserRouter>
   <Nav/>
   <Routes>

<Route path='/' element={<Home/>}/>
<Route path='/about' element={<About/>}/>
<Route path='/contact' element={<Contact/>}/>
<Route path='/domain' element={<Domain/>}/>
<Route path='/domain/java' element={<Java/>}/>
<Route path='/domain/python' element={<Python/>}/>
<Route path='/domain/mern' element={<Mern/>}/>
<Route path='/domain/mean' element={<MEAN/>}/>
<Route path='/feedback' element={<Feedback/>}/>
<Route path='/login' element={<Login />} />
{/* <Route path='/sign' element={<Signin />} /> */}
<Route path='/domain/aws' element={<Aws />} /> 
<Route path='/domain/dataanalytics' element={<DataAnalytics />}  />
<Route path='/domain/datascience' element={<DataScience/>} />

   </Routes>
   
   <Footer/>
   </BrowserRouter>
   </>
  )
}

export default App
