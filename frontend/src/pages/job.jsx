import { Button, Typography } from "@material-tailwind/react";
import BASEURL from "../data/requests";
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

  // Function to format the postDate
  const formatPostDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust this to your desired format
  };

  console.log(job.description);

  return (
    !loading && (
      <>
        <section className="relative block h-[100px]">
          <div className="bg-profile-background absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
          <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        </section>
        <section className="bg-white py-16 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img
                  className="w-20 h-20 mr-4 rounded-full"
                  src={`${BASEURL}/company/image/${job.company.id}`}
                  alt={`company logo`}
                />
                <Typography>{job.company.name}</Typography>
              </div>
              {localStorage.getItem("token") !== undefined && (
                <Link to={`/apply/${job.id}/${job.company.id}`}>
                  <Button>Apply Now</Button>
                </Link>
              )}
            </div>
            <Typography className="text-3xl font-bold mb-4">
              {job.title}
            </Typography>
            <Typography className="text-gray-600 mb-4">
              {job.location}
            </Typography>
            <Typography className="text-gray-600 mb-4">
              company rating: {job.company.rating}
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
            {/* Format and display the postDate */}
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
