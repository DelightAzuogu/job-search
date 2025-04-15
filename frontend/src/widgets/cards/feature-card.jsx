import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import BASEURL from "@/data/requests";
import { Link } from "react-router-dom";

export function FeatureCard({ job }) {
  const { company, title, salaryRange, jobType, locationType, location, id } =
    job;

  return (
    <Link to={`/job/${id}`}>
      <Card className="rounded-lg shadow-lg max-w-full">
        <CardHeader className="p-2" style={{ height: "150px", width: "150px" }}>
          <img
            src={`${BASEURL}/company/image/${company.id}`}
            alt={`${company.name} logo`}
          />
        </CardHeader>
        <CardBody className="py-4">
          <Typography variant="h4" className="mb-2">
            {title}
          </Typography>
          <Typography className="text-sm font-semibold mb-1">
            {company.name}
          </Typography>
          <Typography className="text-sm font-semibold mb-1">
            Company rating: {company.rating}
          </Typography>
          <Typography className="text-sm font-normal mb-2">
            {location}
          </Typography>
          <div className="flex  text-xs text-gray-600 mb-2">
            {`${jobType} • ${locationType}`}
          </div>
          <Typography className="text-sm font-normal">{salaryRange}</Typography>
        </CardBody>
      </Card>
    </Link>
  );
}

FeatureCard.displayName = "/src/widgets/layout/feature-card.jsx";

export default FeatureCard;
