import BaseUrl from "../data/requests";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function SignUp() {
  const [error, setError] = useState(false);
  const [msg, setMessage] = useState("");

  const navigate = useNavigate();

  async function SignUpHandler(e) {
    e.preventDefault();

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      setError(false);
      const response = await fetch(`${BaseUrl}/user/signin`, {
        method: "POST",
        body: JSON.stringify({
          email,
          name,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      localStorage.setItem("userId", responseData.userId);
      localStorage.setItem("token", responseData.token);

      navigate("/home");
    } catch (error) {
      setError(true);
      setMessage(error.msg ?? error.message);
      console.error(error);
    }
  }

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Join Us Today
          </Typography>
        </div>
        {error && (
          <div className="text-center">
            <Typography
              variant="paragraph"
              color="red"
              className="text-lg font-normal"
            >
              {msg}
            </Typography>
          </div>
        )}
        <form
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={(e) => SignUpHandler(e)}
        >
          <div className="mb-6 flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Your name
            </Typography>
            <Input
              size="lg"
              placeholder="Your name"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>

          <div className="mb-6 flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>

          <div className="mb-6 flex flex-col gap-6">
            {/* Password input */}
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Password
            </Typography>
            <Input
              size="lg"
              type="password"
              placeholder="Enter your password"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>

          <Button className="mt-6" fullWidth type="submit">
            Register Now
          </Button>

          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Already have an account?
            <Link to="/sign-in" className="text-gray-900 ml-1">
              Sign in
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
