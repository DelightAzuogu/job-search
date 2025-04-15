import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Option,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import BASEURL from "@/data/requests";
import { useParams } from "react-router-dom";

export function EditJob() {
  const jobTypes = ["full-time", "part-time", "contract", "internship"];
  const locationTypes = ["remote", "hybrid", "onsite"];

  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    jobType: "",
    locationType: "",
    salaryRange: "",
    location: "",
    endDate: new Date(),
  });
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [jobQuestions, setJobQuestions] = useState([]);

  async function getJob() {
    try {
      const response = await fetch(`${BASEURL}/job/${id}`, {
        method: "GET",
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      setFormData({
        ...formData,
        title: responseData.job.title || "",
        description: responseData.job.description || "",
        jobType: responseData.job.jobType || "",
        locationType: responseData.job.locationType || "",
        salaryRange: responseData.job.salaryRange || "",
        location: responseData.job.location || "",
        endDate: new Date(responseData.job.endDate) || new Date(),
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getJob();
  }, []);

  const handleChange = (e) => {
    setError(false);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleJobtypeChange = (e) => {
    setError(false);
    setFormData({ ...formData, jobType: e });
  };

  const handlelocationTypeChange = (e) => {
    setError(false);
    setFormData({ ...formData, locationType: e });
  };

  const onSubmitCreateJobForm = async (e) => {
    e.preventDefault();

    try {
      setError(false);
      const response = await fetch(`${BASEURL}/company/edit-job/${id}`, {
        method: "POST",
        body: JSON.stringify({ ...formData }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const responseData = await response.json();

      console.log(responseData);
      if (!response.ok) {
        throw responseData;
      }

      getJob();
    } catch (error) {
      setError(true);
      setMsg(error.msg || error.message);
      console.error(error);
    }
  };

  return (
    <>
      <section className="relative block h-[100px]">
        <div className="bg-profile-background absolute top-0 h-full w-[100%] bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
      </section>
      <section className=" py-16 4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full  text-center lg:w-8/12">
              <form onSubmit={onSubmitCreateJobForm} className="mb-[10px]">
                <div className="mb-[10px]">
                  <Typography variant="h1">Edit Job</Typography>
                </div>
                {error && (
                  <div className="mb-[10px]">
                    <Typography>{msg}</Typography>
                  </div>
                )}
                <div className="mb-[10px]">
                  <Input
                    label="Job Title"
                    size="lg"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-[10px]">
                  <Textarea
                    label="Description"
                    rows="10"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex gap-10 mb-[10px]">
                  <div>
                    <Select
                      label="Job Type"
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleJobtypeChange}
                      required
                    >
                      {jobTypes.map((j) => (
                        <Option key={j} value={j}>
                          {j}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Select
                      label="Location Type"
                      name="locationType"
                      value={formData.locationType}
                      onChange={handlelocationTypeChange}
                      required
                    >
                      {locationTypes.map((l) => (
                        <Option key={l} value={l}>
                          {l}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="mb-[10px]">
                  <Input
                    label="Salary Range"
                    size="lg"
                    type="text"
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-[10px]">
                  <Input
                    label="Location"
                    size="lg"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-[10px]">
                  <Input
                    label="End Date"
                    size="lg"
                    type="date"
                    name="endDate"
                    required
                    value={
                      formData.endDate
                        ? formData.endDate.toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" className="mt-6" fullWidth>
                  EDIT
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EditJob;
