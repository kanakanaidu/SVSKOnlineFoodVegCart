import Lotti from "lottie-react";
import { useNavigate } from "react-router-dom";
import Button from "./reusables/Button";
import NotAuthorized from "../assets/lotti-animation/403-3.json";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase.config";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { fetchConfig } from "../utils/firebaseFunctions";
import { useEffect, useState } from "react";
import { setUserRole } from "../utils/userService";

const firebaseAuth = getAuth(app);
const provider = new GoogleAuthProvider();

const Unauthorized = () => {
  // const error: any = useRouteError();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [role, setRole] = useState<string | null>(null);

  const login = async () => {
    try {
      const {
        user: { refreshToken, providerData },
      } = await signInWithPopup(firebaseAuth, provider);
      console.log(refreshToken, providerData[0]);
      dispatch(setUser({ refreshToken, ...providerData[0] }));

      // const userRole = await setUserRole(providerData[0]);
      const adminEmailsString = await fetchConfig("REACT_APP_ADMIN_EMAILS");
      // @ts-ignore
      const adminEmails = adminEmailsString?.REACT_APP_ADMIN_EMAILS;
      const userRole = adminEmails.includes(providerData[0].email)
        ? "admin"
        : "user";
      setRole(userRole);
      if (providerData[0]) setUserRole(providerData[0], userRole);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem(
        "user",
        JSON.stringify({ refreshToken, ...providerData[0] })
      );
      console.log("role: ", role);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  let hasLoggedIn = false;
  useEffect(() => {
    if (!hasLoggedIn) {
      login();
      hasLoggedIn = true;
    }
  }, []); // This ensures login is called only on initial mount.

  return (
    <div
      id="error-page"
      className="w-full h-screen p-2 flex flex-col items-center justify-center overflow-hidden"
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold text-headingColor">
        Oops! You do not have permission to view this page.
      </h1>
      <p className="text-xl text-textColor font-semibold mt-2">
        {/* {error.statusText || error.message} */}
        403 - Unauthorized
      </p>
      <Lotti className="h-[70vh] w-[70vh]" animationData={NotAuthorized} />
      {/* <Button onClick={() => navigate("/", { replace: true })} size="lg"> */}
      <Button onClick={() => login()} size="lg">
        Login to place the Order
      </Button>
    </div>
  );
};

export default Unauthorized;
