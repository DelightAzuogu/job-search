import BASEURL from "@/data/requests";
import { Button, Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const JobQuestions = () => {
  const [jobQuestions, setJobQuestions] = useState([]);
  const { id } = useParams();

  async function getJobQuestions() {
    try {
      const response = await fetch(`${BASEURL}/job/questions/${id}`, {
        method: "GET",
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      setJobQuestions(responseData.jobQuestions);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getJobQuestions();
  }, []);

  const handleQuestionChange = (index, newValue) => {
    setJobQuestions((prevQuestions) =>
      prevQuestions.map((question, i) =>
        i === index ? { ...question, question: newValue } : question
      )
    );
  };

  const handleSubmit = async (event, questionId) => {
    event.preventDefault();

    const question = event.target[0].value;

    try {
      const response = await fetch(
        `${BASEURL}/company/job/question/edit/${questionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            jobId: id,
            question: question,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      getJobQuestions();
    } catch (error) {
      console.error(error);
    }
  };

  const CreateNewJobQuestion = async (event) => {
    event.preventDefault();

    const question = event.target[0].value;

    try {
      const response = await fetch(`${BASEURL}/company/job/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          jobId: id,
          question: question,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      getJobQuestions();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="relative block h-[100px]">
        <div className="bg-profile-background absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
      </section>
      <section className="bg-white py-16">
        <div className="container mx-auto">
          {jobQuestions.map((jobQuestion, index) => (
            <div key={index} className="mb-4">
              <form
                onSubmit={(e) => handleSubmit(e, jobQuestion.id)}
                className="flex items-center"
              >
                <Input
                  size="lg"
                  type="text"
                  name={`question_${index}`}
                  value={jobQuestion.question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="mr-2 h-full"
                  required
                />
                <Button type="submit" size="lg" className="h-full">
                  Update
                </Button>
              </form>
            </div>
          ))}
        </div>
        <div className="container mx-auto">
          <div className="mb-4">
            <form onSubmit={CreateNewJobQuestion} className="flex items-center">
              <Input
                size="lg"
                type="text"
                className="mr-2 h-full"
                label="Add new job question"
                required
              />
              <Button type="submit" size="lg" className="h-full">
                Add
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default JobQuestions;
