import React from 'react';

const ItianSidebarProfile = ({ profile }) => {
  if (!profile) return null;

  const {
    first_name,
    last_name,
    profile_picture_url,
    bio,
    current_job_title,
    current_company,
    linkedin_profile_url,
    github_profile_url,
    portfolio_url,
    experience_years,
    graduation_year,
    iti_track,
    skills,
    projects
  } = profile;

  return (
    <div className="bg-white rounded-2xl shadow-md p-0 sticky top-6 h-[90vh] overflow-hidden relative">
      {/* Header with Show Profile Button */}
      <div className="flex justify-end p-3">
        <a
          href="/itian-profile"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-red-500 hover:text-red-700 underline"
        >
          Show Profile
        </a>
      </div>

      {/* Scrollable Content */}
      <div className="px-6 pb-6 overflow-y-auto h-[calc(100%-3rem)] scrollbar scrollbar-thumb-red-300 scrollbar-track-gray-100 pr-2">
        <div className="flex flex-col items-center text-center">
          <img
            src={profile_picture_url || `https://ui-avatars.com/api/?name=${first_name}+${last_name}`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-4 shadow"
          />
          <h2 className="text-xl font-semibold text-gray-800">
            {first_name} {last_name}
          </h2>
          <p className="text-gray-500 text-sm">
            {current_job_title} at {current_company}
          </p>
          {bio && <p className="mt-2 text-sm text-gray-600 italic">{bio}</p>}
        </div>

        <hr className="my-4 border-gray-200" />

        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Experience:</strong> {experience_years} years</p>
          <p><strong>Track:</strong> {iti_track}</p>
          <p><strong>Graduation:</strong> {graduation_year}</p>
        </div>

        {skills?.length > 0 && (
          <>
            <hr className="my-4 border-gray-200" />
            <div>
              <h4 className="text-gray-800 font-semibold mb-1">Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span
                    key={skill.id}
                    className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {projects?.length > 0 && (
          <>
            <hr className="my-4 border-gray-200" />
            <div>
              <h4 className="text-gray-800 font-semibold mb-1">Projects:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {projects.map(project => (
                  <li key={project.id}>
                    <a
                      href={project.project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 hover:underline"
                    >
                      {project.project_title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <hr className="my-4 border-gray-200" />

        <div className="flex justify-center gap-4 flex-wrap">
          {linkedin_profile_url && (
            <a
              href={linkedin_profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              LinkedIn
            </a>
          )}
          {github_profile_url && (
            <a
              href={github_profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:underline text-sm"
            >
              GitHub
            </a>
          )}
          {portfolio_url && (
            <a
              href={portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:underline text-sm"
            >
              Portfolio
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItianSidebarProfile;
