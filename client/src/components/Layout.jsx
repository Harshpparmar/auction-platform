import Navbar from './Navbar';

const Layout = ({ children, isAdmin = false, hideNavForAdmin = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {!hideNavForAdmin && <Navbar isAdmin={isAdmin} />}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;