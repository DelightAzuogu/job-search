import BASEURL from "@/data/requests";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

const JobApplications = () => {
  const { id } = useParams();

  const [applications, setApplications] = useState([]);

  async function getJobApplications() {
    try {
      const response = await fetch(
        `${BASEURL}/company/job/applications/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      setApplications(responseData.jobApplications);
    } catch (error) {
      console.error(error);
    }
  }

  async function declineApplication(userId, event) {
    event.stopPropagation();
    try {
      const response = await fetch(
        `${BASEURL}/company/decline/application/${id}/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const responseData = await response.json();
        throw responseData;
      }

      getJobApplications();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getJobApplications();
  }, []);

  return (
    <>
      <section className="relative block h-[100px]">
        <div className="bg-profile-background absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
      </section>
      <section className="bg-white py-16">
        <div className="container mx-auto">
          <div className="mb-[10px]">
            <Typography variant="h1">Job Applications</Typography>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {applications.map(({ user }, index) => (
              <div key={index}>
                <Link to={`/user-application/${id}/${user.id}`}>
                  <Card className="rounded-lg shadow-lg max-w-full">
                    <CardBody className="py-4">
                      <Typography variant="h4" className="mb-2">
                        {user.name}
                      </Typography>
                      <Typography variant="paragraph" className="mb-2">
                        {user.email}
                      </Typography>
                    </CardBody>
                  </Card>
                </Link>
                <Button
                  color="red"
                  className="mt-2"
                  onClick={(event) => declineApplication(user.id, event)}
                >
                  Decline Application
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default JobApplications;
