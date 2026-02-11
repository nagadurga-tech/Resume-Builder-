import { Mail, Phone, MapPin } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const profileImage =
    typeof data.personal_info?.image === "string"
      ? data.personal_info.image
      : data.personal_info?.image
      ? URL.createObjectURL(data.personal_info.image)
      : null;

  return (
    <div className="max-w-5xl mx-auto bg-white text-zinc-800 p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ===== LEFT COLUMN ===== */}
        <aside className="md:col-span-1 border-b md:border-b-0 md:border-r border-zinc-300 pb-6 md:pb-0">

          {/* Image */}
          {profileImage && (
            <div className="flex justify-center mb-6">
              <img
                src={profileImage}
                alt="Profile"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover"
                style={{ backgroundColor: accentColor + "30" }}
              />
            </div>
          )}

          {/* Name */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold tracking-widest">
              {data.personal_info?.full_name || "Your Name"}
            </h1>
            <p className="text-sm uppercase tracking-widest text-zinc-600">
              {data.personal_info?.profession || "Profession"}
            </p>
          </div>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-xs font-semibold tracking-widest text-zinc-500 mb-3">
              CONTACT
            </h2>
            <div className="space-y-2 text-sm">
              {data.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} style={{ color: accentColor }} />
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-center gap-2 break-all">
                  <Mail size={14} style={{ color: accentColor }} />
                  <span>{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: accentColor }} />
                  <span>{data.personal_info.location}</span>
                </div>
              )}
            </div>
          </section>

          {/* Education */}
          {data.education?.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-semibold tracking-widest text-zinc-500 mb-3">
                EDUCATION
              </h2>
              <div className="space-y-4 text-sm">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-semibold uppercase">{edu.degree}</p>
                    <p className="text-zinc-600">{edu.institution}</p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(edu.graduation_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills?.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold tracking-widest text-zinc-500 mb-3">
                SKILLS
              </h2>
              <ul className="space-y-1 text-sm">
                {data.skills.map((skill, index) => (
                  <li key={index}>• {skill}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* ===== RIGHT COLUMN ===== */}
        <main className="md:col-span-2">

          {/* Summary */}
          {data.professional_summary && (
            <section className="mb-8">
              <h2
                className="text-xs font-semibold tracking-widest mb-3"
                style={{ color: accentColor }}
              >
                SUMMARY
              </h2>
              <p className="text-zinc-700 leading-relaxed">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience?.length > 0 && (
            <section className="mb-8">
              <h2
                className="text-xs font-semibold tracking-widest mb-4"
                style={{ color: accentColor }}
              >
                EXPERIENCE
              </h2>

              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h3 className="font-semibold">{exp.position}</h3>
                      <span className="text-xs text-zinc-500">
                        {formatDate(exp.start_date)} –{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>

                    <p
                      className="text-sm font-medium mb-2"
                      style={{ color: accentColor }}
                    >
                      {exp.company}
                    </p>

                    {exp.description && (
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {exp.description.split("\n").map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects – FIXED */}
          {data.projects?.length > 0 && (
            <section>
              <h2
                className="text-xs font-semibold tracking-widest mb-4"
                style={{ color: accentColor }}
              >
                PROJECTS
              </h2>

              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="font-medium">{project.title}</h3>

                    {project.technologies && (
                      <p className="text-sm text-zinc-600">
                        Tech: {project.technologies}
                      </p>
                    )}

                    {project.description && (
                      <p className="text-sm text-zinc-700 mt-1">
                        {project.description}
                      </p>
                    )}

                    {project.link && (
                      <a
                        href={project.link}
                        className="text-sm text-blue-600 break-all hover:underline"
                      >
                        {project.link}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MinimalImageTemplate;
