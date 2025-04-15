import { Input, Textarea } from "@material-tailwind/react";
import React from "react";

const QuestionInput = ({ index, setQuestions, questions }) => {
  return (
    <>
      <Textarea
        size="md"
        label={questions[index].question}
        required
        value={questions[index].answer || ""}
        onChange={(e) => {
          const newQuestions = questions.map((q, i) => {
            if (i !== index) {
              return q;
            }

            return { ...q, answer: e.target.value };
          });

          setQuestions(newQuestions);
        }}
      />
    </>
  );
};

export default QuestionInput;
