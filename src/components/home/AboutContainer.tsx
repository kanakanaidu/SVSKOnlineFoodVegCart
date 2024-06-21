const AboutContainer = () => {
  return (
    <div
      id="about"
      className="container-padding flex flex-col gap-8 w-full pt-6"
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 w-full items-center gap-2 xs:gap-4 md:gap-10">
        <div className="overflow-hidden">
          <img
            className="object-cover w-full h-full rounded-md"
            src="/images/about/quality.jpg"
            alt=""
          />
        </div>

        <div className="md:px-4 flex flex-col gap-10 relative">
          <img
            className="z-[-1] rotate-12 w-80 opacity-75 aspect-square absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            src="/images/about/orange-seller.png"
            alt=""
          />
          <div className="col-span-3 text-start flex flex-col gap-2">
            <p className="text-base relative w-fit sm:text-2xl md:text-4xl text-textColor font-semibold">
              About Our Passion for Quality
              <span className="absolute bottom-0 right-0 w-3/4 h-[2px] bg-textColor"></span>
            </p>
            <p className="text-xxs sm:text-xs md:text-base">
              At <span className="font-semibold">SVSK Online Store</span>, we're not
              just passionate about food; we're passionate about delivering the
              highest quality, freshest, and most delicious products to your
              table. Our journey began with a simple goal - to provide families
              with access to wholesome, farm-fresh produce that's as good for
              you as it is for the planet.
            </p>
          </div>

          <div className="text-start mt-0">
            <p className="relative w-fit text-base sm:text-2xl md:text-4xl text-textColor font-semibold">
              Our Roots
              <span className="absolute bottom-0 right-0 w-3/4 h-[2px] bg-textColor"></span>
            </p>
            <p className="text-xxs sm:text-xs md:text-base mt-2">
              Founded in 2023, our roots run deep in the fertile soils of India.
              We believe in sustainable farming practices that nurture the land
              and promote biodiversity. Our commitment to ethical sourcing and
              local partnerships ensures that you receive the very best nature
              has to offer, right at your doorstep.
            </p>
          </div>

          <div className="text-start ">
            <p className="relative w-fit text-base sm:text-2xl md:text-4xl text-textColor font-semibold">
              Farm to Your Table
              <span className="absolute bottom-0 right-0 w-3/4 h-[2px] bg-textColor"></span>
            </p>
            <p className="text-xxs sm:text-xs md:text-base mt-2">
              We take pride in being a part of the farm-to-table movement. It's
              not just a trend; it's a commitment to quality and sustainability.
              We work closely with local farmers who share our passion for
              growing produce with care and love. Every fruit, vegetable, and
              grain is handpicked at the peak of ripeness, ensuring that you
              enjoy the full flavors and nutritional benefits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContainer;
