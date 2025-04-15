import JobApplications from "./pages/Job-applications";
import CreateJob from "./pages/create-job";
import EditJob from "./pages/edit-job";
import Home from "./pages/home";
import Job from "./pages/job";
import JobQuestions from "./pages/job-questions";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import UserApplication from "./pages/user-application";
import Jobs from "./pages/view-all-jobs";

export const routes = [
  {
    name: "Home",
    path: "/home",
    element: <Home />,
    show: true,
  },
];

export const routing = () => {
  if (localStorage.getItem("token") === null) {
    return [
      ...routes,
      {
        name: "Sign In",
        path: "/sign-in",
        element: <SignIn />,
        show: false,
      },
      {
        name: "Sign Up",
        path: "/sign-up",
        element: <SignUp />,
        show: false,
      },
    ];
  } else {
    return [
      ...routes,
      {
        name: "Create Job",
        path: "/create-job",
        element: <CreateJob />,
        show: true,
      },
      {
        name: "View All",
        path: "/view-all",
        element: <Jobs />,
        show: true,
      },
      {
        name: "View Job",
        path: "/job/:id",
        element: <Job />,
        show: false,
      },
      {
        name: "View Job",
        path: "/edit-job/:id",
        element: <EditJob />,
        show: false,
      },
      {
        name: "Job Question",
        path: "/job-question/:id",
        element: <JobQuestions />,
        show: false,
      },
      {
        name: "Job Applications",
        path: "/job-applications/:id",
        element: <JobApplications />,
        show: false,
      },
      {
        name: "User Application",
        path: "/user-application/:jobId/:userId",
        element: <UserApplication />,
        show: false,
      },
    ];
  }
};

export default routing;
