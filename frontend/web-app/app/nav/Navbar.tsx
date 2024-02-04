import Search from "./Search";
import Logo from "./Logo";

const Navbar = () => (
  <header className="sticky top-0 z-50 flex justify-between bg-white p-5 items-center text-gray-800 shadow-md">
    <div>
      <Logo />
    </div>
    <Search />
    <div>Login</div>
  </header>
);

export default Navbar;
