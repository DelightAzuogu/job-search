import BASEURL from "@/data/requests";
import React, { useEffect, useState } from "react";
import QuestionInput from "./questionInput";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";

const Apply = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState({});
  const [error, setErrorMessageState] = useState("");
  const [rating, setRating] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate();
  const { id, companyId } = useParams();

  async function getQuestions() {
    setLoading(true);
    try {
      const response = await fetch(`${BASEURL}/job/questions/${id}`, {
        method: "GET",
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }
      setLoading(false);
      setQuestions(responseData.jobQuestions);
      setJob(responseData.job);
    } catch (error) {
      setLoading(true);
      console.error(error);
    }
  }

  useEffect(() => {
    getQuestions();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();

    const requestForm = new FormData();
    const fileInput = document.getElementById("resume");
    if (fileInput.files.length === 0) {
      setErrorMessageState("No file selected");
      return;
    }

    const selectedFile = fileInput.files[0];
    requestForm.append("resume", selectedFile);

    try {
      const response = await fetch(`${BASEURL}/user/job/apply/${id}`, {
        method: "POST",
        body: JSON.stringify({
          jobQuestions: questions,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      const responseData = await response.json();

      const resumeResponse = await fetch(
        `${BASEURL}/user/job/resume/${responseData.applicationId}`,
        {
          method: "POST",
          body: requestForm,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!resumeResponse.ok) {
        throw new Error("Failed to submit application");
      }

      console.log("Application submitted successfully!");

      // Show rating popup after successful application submission
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  }

  async function submitRating() {
    try {
      const newRating = rating > 10 ? 10 : rating;
      const response = await fetch(
        `${BASEURL}/user/rating/${companyId}/${newRating}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      console.log("Rating submitted successfully!");

      navigate("/home");
      setIsPopupOpen(false); // Close the popup after successful rating submission
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  }

  return (
    !loading && (
      <>
        <section className="relative block h-[100px]">
          <div className="bg-profile-background absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
          <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        </section>
        <section className="bg-white py-16 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
          <form onSubmit={onSubmit}>
            <div className="p-4">
              <Typography className="text-3xl font-bold mb-4">
                Apply for {job.title}
              </Typography>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload CV
              </label>
              <input
                id="resume"
                type="file"
                className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {error && <Typography color="red">{error}</Typography>}
            </div>
            {questions.map((q, index) => (
              <div key={q.id} className={index > 0 ? "mt-4" : ""}>
                <QuestionInput
                  index={index}
                  setQuestions={setQuestions}
                  questions={questions}
                />
              </div>
            ))}
            <Button type="submit">Submit Application</Button>
          </form>
        </section>

        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <Typography variant="h6" className="mb-4">
                Rate the Company:
              </Typography>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <Button onClick={submitRating} className="mt-4">
                Submit Rating
              </Button>
              <Link to={"/home"}>
                <Button className="mt-4">Skip Rating</Button>
              </Link>
            </div>
          </div>
        )}
      </>
    )
  );
};

export default Apply;
