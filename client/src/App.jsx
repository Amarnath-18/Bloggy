import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import ViewBlogs from './components/ViewBlogs'
import WriteBlog from './components/WriteBlog'
import ViewProfile from './components/ViewProfile'
import ViewMyBlogs from './components/ViewMyBlogs'
import ViewCategoryBlogs from './components/ViewCategoryBlogs'
import Body from './components/Body'
import Login from './components/Login'
import SignUp from './components/SignUp'
import ProtectedRoute from './components/ProtectedRoute'
import ViewSingleBlog from './components/ViewSingleBlog'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Body/>}>
          <Route path='/' element={<Home/>} />
          <Route path='/viewBlogs' element={<ViewBlogs/>}/>
          <Route 
            path='/writeBlog' 
            element={
              <ProtectedRoute>
                <WriteBlog/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/viewProfile' 
            element={
              <ProtectedRoute>
                <ViewProfile/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/myBlogs'
            element={
              <ProtectedRoute>
                <ViewMyBlogs/>
              </ProtectedRoute>
            }
          />
          <Route path='/category/:category' element={<ViewCategoryBlogs/>}/>
          <Route 
            path='/login' 
            element={
                <Login/>
            } 
          />
          <Route 
            path='/register' 
            element={
                <SignUp/>
            } 
          />
          <Route path='/viewBlog/:id' element={<ViewSingleBlog/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App


