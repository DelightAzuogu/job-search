import { Typography, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
        <div className="absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography
                variant="h1"
                color="white"
                className="mb-6 font-black"
              >
                Search For Your Future Job
              </Typography>
              <Link to="/jobs">
                <Button
                  color="grey"
                  buttonType="filled"
                  size="lg"
                  rounded={false}
                  block={false}
                  iconOnly={false}
                  ripple="light"
                  className="py-3 w-64 text-lg hover:bg-gray-800"
                >
                  Explore Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
