import BASEURL from "@/data/requests";
import { Button, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Job = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);

  async function getJob() {
    setLoading(true);
    try {
      const response = await fetch(`${BASEURL}/job/${id}`, {
        method: "GET",
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }
      setLoading(false);
      setJob(responseData.job);
    } catch (error) {
      setLoading(true);
      console.error(error);
    }
  }

  useEffect(() => {
    getJob();
  }, []);

  const formatPostDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    !loading && (
      <>
        <section className="relative block h-[100px]">
          <div className="bg-profile-background absolute top-0 h-full w-[100%] bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
        </section>
        <section className="bg-white py-16 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <Typography className="text-3xl font-bold mr-4">
                {job.title}
              </Typography>
              <Link to={`/edit-job/${id}`}>
                <Button className="h-[40px]">Edit</Button>
              </Link>
            </div>
            <Typography className="text-gray-600 mb-4">
              {job.location}
            </Typography>
            <Typography className="text-gray-600 mb-4">{`${job.jobType} • ${job.locationType}`}</Typography>
            <Typography className="text-gray-600 mb-4">
              {job.salaryRange}
            </Typography>
            <Typography>
              {job.description.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Typography>
            <Typography className="text-gray-600 mb-4">
              Posted: {formatPostDate(job.postDate)}
            </Typography>
          </div>
        </section>
      </>
    )
  );
};

export default Job;
