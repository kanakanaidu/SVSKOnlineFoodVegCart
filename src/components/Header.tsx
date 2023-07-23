import { useState } from "react";
import Logo from "../assets/images/logo.png";
import ProfileImage from "../assets/images/profile-image.png";
import { BsBag } from "react-icons/bs";
import { BiMenuAltLeft, BiSolidUserCircle } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { signInWithPopup, getAuth, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../firebase.config.ts";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice.ts";
import { RootState } from "../store/store.ts";
import { TbLogout } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { toggleIsCartOpen } from "../store/slices/cartSlice.ts";

const firebaseAuth = getAuth(app);
const provider = new GoogleAuthProvider();

const navLinks = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Menu",
    href: "#menu",
  },
  {
    title: "Services",
    href: "/",
  },
  {
    title: "About",
    href: "/",
  },
];

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const numOfCartItems = useSelector(
    (state: RootState) => state.cart.numOfCartItems
  );
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const login = async () => {
    try {
      const {
        user: { refreshToken, providerData },
      } = await signInWithPopup(firebaseAuth, provider);
      console.log(refreshToken, providerData[0]);
      dispatch(setUser({ refreshToken, ...providerData[0] }));
      localStorage.setItem(
        "user",
        JSON.stringify({ refreshToken, ...providerData[0] })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setIsUserMenuOpen(false);
    localStorage.clear();
    dispatch(setUser(null));
  };
  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-primaryBg/60 border-b-2 border-gray-400 backdrop-blur-md">
      <div className="flex px-2 py-4 xs:p-4 md:px-16 md:py-6">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            className="w-7 md:w-10 object-cover"
            alt="Logo Image"
          />
          <p className="hidden xxs:flex text-headingColor text-xl font-bold">
            Fruitsify
          </p>
        </Link>
        <div className="ml-auto flex items-center gap-4 sm:gap-8">
          <motion.ul
            initial={{
              x: -50,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            className="hidden md:flex  items-center gap-8"
          >
            {navLinks.map((link) => {
              return (
                <li
                  key={link.title}
                  className="cursor-pointer font-semibold text-textColor hover:text-headingColor duration-100 transition-all ease-in-out"
                >
                  <a href={link.href}>{link.title}</a>
                </li>
              );
            })}
          </motion.ul>
          <div
            onClick={() => dispatch(toggleIsCartOpen())}
            className="relative flex items-center justify-center"
          >
            <BsBag className="cursor-pointer text-2xl text-textColor" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[2px]">
              <p className="text-sm font-semibold text-textColor select-none cursor-pointer">
                {numOfCartItems}
              </p>
            </div>
          </div>
          <div className="w-14 h-8 sm:w-20 sm:h-12 flex items-center justify-center">
            {user ? (
              <div
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="relative w-full h-full"
              >
                <motion.div
                  className="cursor-pointer w-full h-full rounded-full flex items-center justify-around border-2 border-black  shadow-xl"
                  whileTap={{ scale: 0.8 }}
                >
                  <BiMenuAltLeft className="text-xl sm:text-2xl" />
                  <img
                    className="w-5 sm:w-7 h-auto rounded-full object-cover"
                    src={user.photoURL ? user.photoURL : ProfileImage}
                    alt="Profile Image"
                  />
                </motion.div>
                {/* Dropdown user menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{
                        scale: 0.6,
                        opacity: 0,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                      exit={{
                        scale: 0.6,
                        opacity: 0,
                      }}
                      className="absolute right-0 md:-right-8 top-16 flex flex-col w-40 bg-primaryBg border-gray-600 border rounded-lg shadow-xl py-2"
                    >
                      <ul className="flex md:hidden flex-col">
                        {navLinks.map((link) => {
                          return (
                            <li
                              key={link.title}
                              className="cursor-pointer flex justify-between px-6 py-2 gap-2 border-b border-gray-600 items-center hover:bg-primary hover:text-white transition"
                            >
                              <Link to={link.href}>{link.title}</Link>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="cursor-pointer flex justify-between px-6 py-2 gap-2 items-center hover:bg-primary hover:text-white transition">
                        <p>Account</p>
                        <BiSolidUserCircle className="text-[1.35rem]" />
                      </div>
                      {user.email === "nj7055233@gmail.com" && (
                        <Link
                          to="/addItem"
                          className="flex justify-between px-6 py-2 gap-2 border-t border-gray-600 items-center hover:bg-primary hover:text-white transition"
                        >
                          <p>Add Item</p>
                          <IoMdAdd className="text-[1.35rem]" />
                        </Link>
                      )}
                      <div
                        onClick={logout}
                        className="cursor-pointer border-t rounded-b-lg border-gray-600 flex justify-between px-6 py-2 gap-2 items-center hover:bg-primary hover:text-white transition"
                      >
                        <p>Logout</p>
                        <TbLogout className="text-[1.35rem]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={login}
                whileTap={{ scale: 0.8 }}
                className="bg-primary text-sm sm:text-base text-white w-full h-full rounded-full font-medium shadow-xl"
              >
                Login
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
