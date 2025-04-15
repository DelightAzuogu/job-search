import { Home, SignIn, SignUp } from "@/pages";
import Jobs from "./pages/jobs";
import Job from "./pages/job";
import Apply from "./pages/apply";

export const routes = [
  {
    name: "home",
    path: "/home",
    element: <Home />,
    show: true,
  },
  {
    name: "Job search",
    path: "/jobs",
    element: <Jobs />,
    show: true,
  },
  {
    name: "Job",
    path: "/job/:id",
    element: <Job />,
    show: false,
  },
  {
    name: "apply",
    path: "/apply/:id/:companyId",
    element: <Apply />,
    show: false,
  },
];

export const routing = () => {
  if (localStorage.getItem("token") === null) {
    return [
      {
        name: "home",
        path: "/home",
        element: <Home />,
        show: true,
      },
      {
        name: "Job search",
        path: "/jobs",
        element: <Jobs />,
        show: true,
      },
      {
        name: "Job",
        path: "/job/:id",
        element: <Job />,
        show: false,
      },
      {
        name: "apply",
        path: "/apply/:id/:companyId",
        element: <Apply />,
        show: false,
      },
      {
        name: "Sign In",
        path: "/sign-in",
        element: <SignIn />,
        show: true,
      },
      {
        name: "Sign Up",
        path: "/sign-up",
        element: <SignUp />,
        show: true,
      },
    ];
  } else {
    return [
      {
        name: "home",
        path: "/home",
        element: <Home />,
        show: true,
      },
      {
        name: "Job search",
        path: "/jobs",
        element: <Jobs />,
        show: true,
      },
      {
        name: "Job",
        path: "/job/:id",
        element: <Job />,
        show: false,
      },
      {
        name: "apply",
        path: "/apply/:id/:companyId",
        element: <Apply />,
        show: false,
      },
    ];
  }
};

export default routing;
