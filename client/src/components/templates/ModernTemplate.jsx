import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white text-gray-900 text-sm leading-relaxed">

      {/* HEADER */}
      <header
        className="px-6 py-5 border-b"
        style={{ borderColor: accentColor }}
      >
        <h1 className="text-3xl font-semibold tracking-wide">
          {data.personal_info?.full_name || "Your Name"}
        </h1>

        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-gray-700">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <a
              href={data.personal_info.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              <Linkedin className="size-4" />
              <span>{data.personal_info.linkedin.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {data.personal_info?.website && (
            <a
              href={data.personal_info.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              <Globe className="size-4" />
              <span>{data.personal_info.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
        </div>
      </header>

      {/* BODY */}
      <div className="px-6 py-6 space-y-8">

        {/* SUMMARY */}
        {data.professional_summary && (
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-wide mb-2"
              style={{ color: accentColor }}
            >
              Professional Summary
            </h2>
            <p className="text-gray-800">{data.professional_summary}</p>
          </section>
        )}

        {/* EXPERIENCE */}
        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-wide mb-4"
              style={{ color: accentColor }}
            >
              Experience
            </h2>

            <div className="space-y-5">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exp.position}</h3>
                      <p className="text-gray-700">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-600">
                      {formatDate(exp.start_date)} –{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="mt-2 text-gray-800 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {data.projects?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-wide mb-4"
              style={{ color: accentColor }}
            >
              Projects
            </h2>

            <div className="space-y-4">
              {data.projects.map((p, index) => (
                <div key={index}>
                  <h3 className="font-semibold">{p.name}</h3>
                  {p.description && (
                    <p className="mt-1 text-gray-800">
                      {p.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION & SKILLS */}
        <div className="grid sm:grid-cols-2 gap-8">

          {/* EDUCATION */}
          {data.education?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold uppercase tracking-wide mb-3"
                style={{ color: accentColor }}
              >
                Education
              </h2>

              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-700">{edu.institution}</p>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{formatDate(edu.graduation_date)}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SKILLS */}
          {data.skills?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold uppercase tracking-wide mb-3"
                style={{ color: accentColor }}
              >
                Skills
              </h2>

              <ul className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <li
                    key={index}
                    className="px-3 py-1 border rounded text-xs"
                    style={{ borderColor: accentColor }}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
