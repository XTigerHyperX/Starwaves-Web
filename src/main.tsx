import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import './styles.css'
import RootLayout from './components/layout/RootLayout'
import HomePage from './pages/Home'
import ServicesPage from './pages/Services'
import PartnersPage from './pages/Partners'
import WorkPage from './pages/Work'
import ContactPage from './pages/Contact'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'partners', element: <PartnersPage /> },
      { path: 'work', element: <WorkPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
