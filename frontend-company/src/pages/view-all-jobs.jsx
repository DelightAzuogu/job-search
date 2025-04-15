import { useEffect, useState } from "react";
import BASEURL from "../data/requests";
import FeatureCard from "../components/feature-cards";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  async function getJobs() {
    try {
      const response = await fetch(
        `${BASEURL}/job/company/all/${localStorage.getItem("companyId")}`,
        {
          method: "GET",
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      setJobs(responseData.jobs);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getJobs();
  }, []);

  async function onToogleStatus(jobId) {
    try {
      const response = await fetch(
        `${BASEURL}/company/update/job/status/${jobId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }
      getJobs();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <section className="relative block h-[100px]">
        <div className="bg-profile-background absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
      </section>
      <section className="bg-white py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {jobs.map((job, i) => (
              <div key={i}>
                <FeatureCard job={job} onToogleStatus={onToogleStatus} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Jobs;
