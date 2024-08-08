import Button from "../reusables/Button";
import { NavHashLink } from "react-router-hash-link";

const heroData = [
  {
    id: 1,
    imageUrl: "/images/hero/ice-creames.png",
    title: "Icecreams",
    description: "Chocolate & Vanilla",
    price: "5.0",
  },
  {
    id: 2,
    imageUrl: "/images/hero/fruits.png",
    title: "Fruits",
    description: "Fresh & Juicy",
    price: "3.0",
  },
  {
    id: 3,
    imageUrl: "/images/hero/drinks.png",
    title: "Drinks",
    description: "Refreshing",
    price: "2.5",
  },
  {
    id: 4,
    imageUrl: "/images/hero/fishes.png",
    title: "Fishes",
    description: "Grilled & Savory",
    price: "5.0",
  },
];

const HeroContainer = () => {
  return (
    <div
      id="hero"
      className="container-padding grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4"
    >
      <div className="flex flex-col items-start  justify-center gap-4 md:gap-6">
        <div className="flex items-center gap-3 bg-primary p-2 rounded-full">
          <p className="text-lg font-base text-white">Fastest Delivery</p>
          <div className="rounded-full w-9 h-9 bg-white">
            <img
              src="/images/hero/delivery.png"
              className="object-cover w-full h-full rounded-full"
              alt="Delivery Image"
            />
          </div>
        </div>
        <p className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-wide text-headingColor">
          Get Your Products in <span className="text-primary">Minutes.</span>
        </p>
        <p className="font-medium text-base xl:text-lg ">
          Welcome to <b>Lepakshi Online Kirana Store</b>, your one-stop online destination for all things
          <span className="font-semibold"> fresh and delicious</span>! <br/>
          At <b>Lepakshi Online Kirana Store</b>, we take pride in delivering the finest selection of fruits,
          vegetables, meat, ice creams, and cold drinks right to your doorstep.
        </p>

        <Button className="w-full xl:w-[500px] p-0" size="lg">
          <NavHashLink to="/#slider-container" className="w-full h-full py-3">
            Order Now
          </NavHashLink>
        </Button>
      </div>
      <div className="relative">
        <img
          className="w-full h-auto max-h-[550px] md:w-3/4 md:h-full absolute top-0 right-0"
          src="/images/hero/hero-bg.png"
          alt="Hero Background"
        />
        <div className="w-full md:w-[90%] xl:w-3/4 h-full relative z-10 py-12 grid grid-cols-2 gap-y-14 gap-x-4 sm:gap-x-10 px-4 sm:px-10 md:px-0">
        {/* <img
          className="w-full h-auto max-h-[550px] md:w-3/4 md:h-full absolute top-0 right-0"
          src="/images/logo2.png"
          alt="Hero Background"
        /> */}
          {/* {heroData.map((item) => {
            return (
              <div
                key={item.id}
                className="group bg-gray-300/50 shadow-xl backdrop-blur-md flex flex-col gap-1 items-center cursor-pointer rounded-xl py-2"
              >
                <img
                  className="group-hover:scale-110 transition duration-200  w-40 h-40 object-contain drop-shadow-2xl  -mt-12"
                  src={item.imageUrl}
                  alt="Icecreame Image"
                />
                <p className="font-semibold">{item.title}</p>
                <p className="text-gray-600 text-sm text-center">
                  {item.description}
                </p>
              </div>
            );
          })} */}
        </div>
      </div>
    </div>
  );
};

export default HeroContainer;
