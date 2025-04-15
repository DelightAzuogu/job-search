import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import BASEURL from "@/data/requests";
import { Link } from "react-router-dom";

export function FeatureCard({ job, onToogleStatus }) {
  const {
    company,
    title,
    salaryRange,
    jobType,
    locationType,
    location,
    id,
    status,
  } = job;

  return (
    <Card className="rounded-lg shadow-lg max-w-full">
      <CardBody className="py-4">
        <Typography variant="h4" className="mb-2">
          {title}
        </Typography>
        <Typography className="text-sm font-normal mb-2">{location}</Typography>
        <div className="flex  text-xs text-gray-600 mb-2">
          {`${jobType} • ${locationType}`}
        </div>
        <div className="flex  text-xs text-gray-600 mb-2">
          <Typography className="text-sm font-normal">{salaryRange}</Typography>
        </div>
        <div className="flex text-xs mb-2">
          <Typography
            className={`text-sm font-normal ${
              status ? "text-green-600" : "text-red-600"
            }`}
          >
            {status ? "Active" : "Inactive"}
          </Typography>
        </div>
      </CardBody>
      <CardFooter>
        <div className="flex justify-between items-center space-x-4 mb-[10px]">
          <Button
            className={`flex-2 h-[40px] bg-${
              status ? "red" : "green"
            }-500 text-white font-bold py-2 px-4 rounded`}
            onClick={() => onToogleStatus(id)}
          >
            {status ? "Turn Off" : "Turn On"}
          </Button>
          <Link to={`/job-applications/${id}`}>
            <Button className="flex-1 h-[40px]">Applications</Button>
          </Link>
        </div>
        <div className="flex justify-between items-center space-x-4 mb-[10px]">
          <Link to={`/job/${id}`}>
            <Button>View Job</Button>
          </Link>
          <Link to={`/job-question/${id}`}>
            <Button>Job Questions</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

FeatureCard.displayName = "/src/widgets/layout/feature-card.jsx";

export default FeatureCard;
