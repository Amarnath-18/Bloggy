import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './components/Home'
import ViewBlogs from './components/ViewBlogs'
import WriteBlog from './components/WriteBlog'
import ViewProfile from './components/ViewProfile'
import ViewMyBlogs from './components/ViewMyBlogs'
import Body from './components/Body'

const App = () => {
  return (
    <BrowserRouter basename='/' >
      <Routes>
        <Route path='/' element={<Body/>}>
          <Route path='/' element={<Home/>} />
          <Route path='/viewBlogs' element={<ViewBlogs/>}/>
          <Route path='/writeBlog' element={<WriteBlog/>}/>
          <Route path='/viewProfile' element={<ViewProfile/>}/>
          <Route path='/viewMyBlogs' element={<ViewMyBlogs/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App