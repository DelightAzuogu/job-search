import { FeatureCard } from "@/widgets/cards";
import { useEffect, useState } from "react";
import BASEURL from "../data/requests";

const Jobs = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [maxPageNumber, setMaxPagenumber] = useState(20);
  const [pagination, setPagination] = useState([]);
  const [jobs, setJobs] = useState([]);

  async function getMaxPageNumber() {
    try {
      const response = await fetch(
        `${BASEURL}/job/paginationCount/${pageSize}`,
        {
          method: "GET",
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      setMaxPagenumber(responseData.totalPages);
      const newPagination = [];
      for (let i = 1; i <= responseData.totalPages; i++) {
        newPagination.push(i);
      }
      setPagination(newPagination);
      setPageNumber(1);
    } catch (error) {
      console.error(error);
    }
  }

  async function getPaginatedJobs() {
    try {
      const response = await fetch(
        `${BASEURL}/job/paginated/${pageSize}/${pageNumber}`,
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
    getMaxPageNumber();
  }, [pageSize]);

  useEffect(() => {
    getPaginatedJobs();
  }, [pageNumber]);

  const handlePageNumberChange = (newPageNumber) => {
    if (newPageNumber > 0 && newPageNumber <= maxPageNumber) {
      setPageNumber(newPageNumber);
    }
  };

  return (
    <>
      <section className="relative block h-[10vh]">
        <div className="bg-profile-background absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
      </section>
      <section className="bg-white py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {jobs.map((job, i) => (
              <div key={i}>
                <FeatureCard job={job} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <ul className="flex gap-4">
            {pagination.map((pageNumber) => (
              <li key={pageNumber}>
                <button onClick={() => handlePageNumberChange(pageNumber)}>
                  {pageNumber}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Jobs;
