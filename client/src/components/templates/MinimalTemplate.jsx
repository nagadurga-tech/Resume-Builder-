const MinimalTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 px-4 sm:px-6 md:px-8 py-8 sm:py-10 font-light">

      {/* ===== HEADER ===== */}
      <header className="mb-10 border-b pb-6">
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-wide mb-3"
          style={{ color: accentColor }}
        >
          {data.personal_info?.full_name || "Your Name"}
        </h1>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
          {data.personal_info?.email && <span>{data.personal_info.email}</span>}
          {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
          {data.personal_info?.location && <span>{data.personal_info.location}</span>}
          {data.personal_info?.linkedin && (
            <span className="break-all">{data.personal_info.linkedin}</span>
          )}
          {data.personal_info?.website && (
            <span className="break-all">{data.personal_info.website}</span>
          )}
        </div>
      </header>

      {/* ===== SUMMARY ===== */}
      {data.professional_summary && (
        <section className="mb-10">
          <p className="text-gray-700 leading-relaxed">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* ===== EXPERIENCE ===== */}
      {data.experience?.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs uppercase tracking-widest font-semibold mb-6"
            style={{ color: accentColor }}
          >
            Experience
          </h2>

          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                  <h3 className="text-lg font-medium">{exp.position}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.start_date)} –{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>

                <p className="text-gray-600 mb-2">{exp.company}</p>

                {exp.description && (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== PROJECTS (FIXED) ===== */}
      {data.projects?.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs uppercase tracking-widest font-semibold mb-6"
            style={{ color: accentColor }}
          >
            Projects
          </h2>

          <div className="space-y-6">
            {data.projects.map((project, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium">
                  {project.title}
                </h3>

                {project.technologies && (
                  <p className="text-sm text-gray-500">
                    Tech: {project.technologies}
                  </p>
                )}

                {project.description && (
                  <p className="text-gray-700 mt-1">
                    {project.description}
                  </p>
                )}

                {project.link && (
                  <a
                    href={project.link}
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== EDUCATION ===== */}
      {data.education?.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs uppercase tracking-widest font-semibold mb-6"
            style={{ color: accentColor }}
          >
            Education
          </h2>

          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1"
              >
                <div>
                  <h3 className="font-medium">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-500">
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>

                <span className="text-sm text-gray-500">
                  {formatDate(edu.graduation_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== SKILLS ===== */}
      {data.skills?.length > 0 && (
        <section>
          <h2
            className="text-xs uppercase tracking-widest font-semibold mb-6"
            style={{ color: accentColor }}
          >
            Skills
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {data.skills.join(" • ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
