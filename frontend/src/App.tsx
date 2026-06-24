import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { MainLayout } from './layouts/MainLayout';
import Home from './pages/Home';
import Auth from './pages/Auth/Auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      { path: '/auth', element: <Auth /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
