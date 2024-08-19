import Lotti from "lottie-react";
import { useNavigate } from "react-router-dom";
import Button from "./reusables/Button";
import NotAuthorized from "../assets/lotti-animation/403-3.json";
const Unauthorized = () => {
  // const error: any = useRouteError();
  const navigate = useNavigate();

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
      <Button onClick={() => navigate("/", { replace: true })} size="lg">
        Back to Home
      </Button>
    </div>
  );
};

export default Unauthorized;
