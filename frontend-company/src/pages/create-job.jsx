import React, { useState } from "react";
import {
  Button,
  Input,
  Option,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import BASEURL from "@/data/requests";

export function CreateJob() {
  const jobTypes = ["full-time", "part-time", "contract", "internship"];
  const locationTypes = ["remote", "hybrid", "onsite"];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    jobType: "",
    locationType: "",
    salaryRange: "",
    location: "",
    endDate: "",
  });
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");

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
      setSuccess(false);
      const response = await fetch(`${BASEURL}/company/create-job`, {
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

      setError(false);
      setSuccess(true);
    } catch (error) {
      setError(true);
      setSuccess(false);
      setMsg(error.msg || error.message);
      console.error(error);
    }
  };

  return (
    <>
      <section className="relative block h-[70px]">
        <div className="bg-profile-background absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
      </section>
      <div className="max-w-8xl container relative mx-auto">
        <div className="flex flex-wrap items-center">
          <div className="ml-auto mr-auto w-full  text-center lg:w-8/12">
            <form onSubmit={onSubmitCreateJobForm} className="mt-[50]">
              <div className="mb-[10px]">
                <Typography variant="h1">Create Job</Typography>
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
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
              {success && (
                <div className="mb-[10px]">
                  <Typography color="green">
                    Job Created Successfully
                  </Typography>
                </div>
              )}
              <Button type="submit" className="mt-6" fullWidth>
                CREATE
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateJob;
