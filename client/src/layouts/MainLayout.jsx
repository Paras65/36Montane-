import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

//import Home from '../components/Home';

const MainLayout = () => {
  return (
    <>
     <Navbar theme="camping" /> 
     
      <Outlet />
      <ToastContainer />
      <Footer/>
    </>
  );
};
export default MainLayout;