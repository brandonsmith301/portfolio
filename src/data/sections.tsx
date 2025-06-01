import { motion } from 'framer-motion';

interface ExperienceItem {
  company: string;
  date: string;
  title: string;
  description: string[];
}

interface EducationItem {
  institution: string;
  date: string;
  degree: string;
  description: string[];
}

interface AwardItem {
  title: string;
  date: string;
  issuer: string;
  description: string[];
}

const sectionStyle = `
  relative p-6 
  before:content-[''] before:absolute before:top-0 before:left-0 before:w-8 before:h-8 
  before:border-t-[1.5px] before:border-l-[1.5px] before:border-gray-400 dark:before:border-gray-500
  before:border-dashed before:border-opacity-70
  before:transform before:rotate-[0.5deg] before:translate-x-[0.5px] before:translate-y-[0.5px]
  after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-8 after:h-8 
  after:border-b-[1.5px] after:border-r-[1.5px] after:border-gray-400 dark:after:border-gray-500
  after:border-dashed after:border-opacity-70
  after:transform after:rotate-[-0.5deg] after:translate-x-[-0.5px] after:translate-y-[-0.5px]
  hover:before:border-opacity-100 hover:after:border-opacity-100
  transition-all duration-300
`;

const descriptionStyle = `
  text-sm text-gray-600 dark:text-gray-400 italic mt-0.5
  truncate max-w-[300px] sm:max-w-[400px]
`;


export const sections = [
  {
    title: "Experience",
    content: (
      <div className={`space-y-4 mb-8 ${sectionStyle}`}>
        {[
          {
            company: "Monash University",
            date: "2023 - Present",
            title: "Data Systems Officer",
            description: ["Planning and Performance, Faculty of Arts"]
          },
          {
            company: "Deakin University",
            date: "2023 - Present",
            title: "Research Assistant",
            description: ["Machine Learning for Decision Support Group"]
          }     
        ].map((item: ExperienceItem) => (
          <div key={item.company + item.date}>
            <motion.div
              className="group"
              whileHover={{ scale: 1.02 }}
              style={{ transformOrigin: 'left' }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.company}</h3>
                  <p className="text-base text-gray-700 dark:text-gray-300">{item.title}</p>
                  {item.description[0] && (
                    <p className={descriptionStyle}>{item.description[0]}</p>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">{item.date}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    )
  },
  {
    title: "Education",
    content: (
      <div className={`space-y-4 mb-8 ${sectionStyle}`}>
        {[
          {
            institution: "Deakin University",
            date: "2022 - 2026",
            degree: "Bachelor of Data Science",
            description: ["Weighted Average Mark ~ 93"]
          },
          {
            institution: "Open Polytechnic of New Zealand",
            date: "2022 - 2022",
            degree: "Certificate in Information Technology",
            description: [""]
          },
          {
            institution: "Open Polytechnic of New Zealand",
            date: "2020 - 2021",
            degree: "Diploma of Business",
            description: ["Accounting and Management"]
          }
        ].map((item: EducationItem) => (
          <div key={item.institution + item.date}>
            <motion.div
              className="group"
              whileHover={{ scale: 1.02 }}
              style={{ transformOrigin: 'left' }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.institution}</h3>
                  <p className="text-base text-gray-700 dark:text-gray-300">{item.degree}</p>
                  {item.description[0] && (
                    <p className={descriptionStyle}>{item.description[0]}</p>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">{item.date}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    )
  },
  {
    title: "Awards",
    content: (
      <div className={`space-y-4 mb-8 ${sectionStyle}`}>
        {[
          {
            title: "Highest Achieving Second Year",
            date: "2024",
            issuer: "Deakin University",
            description: ["Undergraduate Second Year Cloud Award 2024"]
          },
          {
            title: "Individual Award for Exceptional Performance",
            date: "2024",
            issuer: "Monash University",
            description: ["Dean's Professional Excellence Award 2024"]
          },
          {
            title: "Team Award for Exceptional Performance",
            date: "2024",
            issuer: "Monash University",
            description: ["Dean's Professional Excellence Award 2024"]
          },
          {
            title: "First Place Winner",
            date: "2023",
            issuer: "Deakin University",
            description: ["Visual Question Answering (VQA) Challenge 2023"]
          }                                  
        ].map((item: AwardItem) => (
          <div key={item.title + item.date}>
            <motion.div
              className="group"
              whileHover={{ scale: 1.02 }}
              style={{ transformOrigin: 'left' }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                  <p className="text-base text-gray-700 dark:text-gray-300">{item.issuer}</p>
                  {item.description[0] && (
                    <p className={descriptionStyle}>{item.description[0]}</p>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">{item.date}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    )
  }
]