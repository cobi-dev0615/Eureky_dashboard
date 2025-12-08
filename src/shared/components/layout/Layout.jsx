import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Notifications from '../Notifications';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <Notifications />
    </div>
  );
};

export default Layout;