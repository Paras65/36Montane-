import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InstallPwaPrompt from '../components/InstallPwaPrompt';

const MainLayout = () => {
  return (
    <>
      <Navbar theme="camping" /> 
      <Outlet />
      <InstallPwaPrompt />
      <ToastContainer />
      <Footer/>
    </>
  );
};
export default MainLayout;
