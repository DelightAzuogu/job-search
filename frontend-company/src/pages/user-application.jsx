import BASEURL from "@/data/requests";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";

const UserApplication = () => {
  const { jobId, userId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState({});
  const [resumeUrl, setResumeUrl] = useState("");

  async function getJobApplication() {
    try {
      const response = await fetch(
        `${BASEURL}/company/user/application/${jobId}/${userId}`,
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

      setQuestions(responseData.jobQuestionAnswer);
      setUser(responseData.user);
      setResumeUrl(responseData.resumeUrl);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getJobApplication();
  }, []);

  return (
    <>
      <section className="relative block h-[100px]">
        <div className="bg-profile-background absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
      </section>
      <section className="bg-white py-16">
        <div className="container mx-auto">
          <Typography variant="h4" className="mb-2">
            Application for {user.name}
          </Typography>{" "}
          <Typography variant="h4" className="mb-2">
            {user.email}
          </Typography>
          {resumeUrl != "" && (
            <a
              href={`${BASEURL}/company/user/application/${jobId}/${userId}/resume`}
              download={`resume_${user.name}_${jobId}.pdf`}
            >
              <Button color="blue" className="mb-4">
                Download Resume
              </Button>
            </a>
          )}
          {questions.map((question, index) => (
            <Card key={index} className="mb-6">
              <CardBody>
                <Typography
                  type="h6"
                  style={{ color: "blue", fontWeight: "bold" }}
                >
                  Question: {question.question}
                </Typography>
                <Typography>Answer:</Typography>
                {question.answer.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default UserApplication;
