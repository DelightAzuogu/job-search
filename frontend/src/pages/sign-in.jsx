import { Input, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function SignIn() {
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const baseUrl = "http://localhost:5700";

  async function LoginHandler(e) {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    console.log(email, password);

    try {
      setError(false);
      const response = await fetch(`${baseUrl}/user/login`, {
        method: "POST",
        body: JSON.stringify({
          email,
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
      console.error(error);
    }
  }

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your email and password to Sign In.
          </Typography>
          {error && (
            <Typography
              variant="paragraph"
              color="red"
              className="text-lg font-normal"
            >
              Invalid Email or password
            </Typography>
          )}
        </div>

        <form
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={(e) => LoginHandler(e)}
        >
          <div className="mb-1 flex flex-col gap-6">
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
              type="email"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Button type="submit" className="mt-6" fullWidth>
            Sign In
          </Button>
          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Not registered?
            <Link to="/sign-up" className="text-gray-900 ml-1">
              Create account
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
