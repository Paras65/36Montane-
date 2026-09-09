import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate 
} from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import NotFoundPage from './pages/NotFoundPage';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Service from './components/Service';
import Booking from './components/Booking';
import Detail from'./components/Detail';
import Tripdetail from './components/Tripdetail';
import Gallery from './components/Gallery';
import Event from './components/Event';
import Blogs from './components/Blog';
import CorporateOffsite from './components/CorporateOffsite';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';


const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Admin Portal Routes (Separate Layout) */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Public Website Routes */}
        <Route path='/' element={<MainLayout />}>
          <Route path='/home' element={<Home />} />
          <Route index element={<Navigate to="/home" replace />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/service' element={<Service />} />
          <Route path='/event' element={<Event />} />
          <Route path='/about' element={<About />} />
          <Route path='/About' element={<Navigate to="/about" replace />} />
          <Route path='/book' element={<Booking />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/Contact' element={<Navigate to="/contact" replace />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/corporate' element={<CorporateOffsite />} />
          <Route path='/detail' element={<Detail />} />
          <Route path='/Detail' element={<Detail />} />
          <Route path='/tripdetail/:id' element={<Tripdetail />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App
