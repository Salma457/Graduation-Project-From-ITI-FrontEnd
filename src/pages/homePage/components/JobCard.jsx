import { MapPin, Clock, DollarSign, Briefcase } from "lucide-react"

export default function JobCard({ job }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 hover:border-red-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{job.job_title}</h3>
            <p className="text-sm text-gray-600">{job.company?.name || "Company"}</p>
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-50 text-red-700 border border-red-200">
          {job.job_type}
        </span>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3">{job.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.job_location || "Remote"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{job.status || "Open"}</span>
          </div>
        </div>

        {(job.salary_range_min || job.salary_range_max) && (
          <div className="flex items-center gap-1 text-sm text-red-600 font-medium">
            <DollarSign className="w-4 h-4" />
            <span>
              {job.salary_range_min && job.salary_range_max
                ? `${job.salary_range_min} - ${job.salary_range_max} ${job.currency}`
                : job.salary_range_min
                  ? `From ${job.salary_range_min} ${job.currency}`
                  : `Up to ${job.salary_range_max} ${job.currency}`}
            </span>
          </div>
        )}

        {job.application_deadline && (
          <div className="text-xs text-gray-500">
            Deadline: {new Date(job.application_deadline).toLocaleDateString()}
          </div>
        )}

        <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  )
}