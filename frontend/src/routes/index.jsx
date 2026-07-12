import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

// We will add real imports later
const Dashboard = () => <div className="p-8">Dashboard Placeholder</div>;
const Login = () => <div className="p-8">Login Placeholder</div>;
const Register = () => <div className="p-8">Register Placeholder</div>;
const MeetingList = () => <div className="p-8">Meeting List Placeholder</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />, // Temporary direct render
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/meetings',
    element: <MeetingList />,
  }
]);
