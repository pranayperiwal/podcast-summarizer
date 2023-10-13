import React from "react";
import { useState } from "react";
// import Accordion from "@mui/material/Accordion";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import Typography from "@mui/material/Typography";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "@/styles/components/summaries/ChaptersContainer.module.css";

const ChaptersContainer = ({ chapters }) => {
  // console.log(chapters);
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function pad(n) {
    return ("00" + n).slice(-2);
  }

  function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ":" + pad(mins) + ":" + pad(secs);
  }

  // const IndividualAccordian = ({ count, title, summary, start, end }) => {
  //   return (
  //     <Accordion
  //       expanded={expanded === "chapter" + count}
  //       onChange={handleChange("chapter" + count)}
  //       style={{ marginBottom: 10, padding: 5 }}
  //     >
  //       <AccordionSummary
  //         expandIcon={<ExpandMoreIcon />}
  //         aria-controls="panel1bh-content"
  //         id="panel1bh-header"
  //         style={{ paddingTop: 30, paddingBottom: 30 }}
  //       >
  //         <Typography
  //           sx={{ color: "text.secondary", width: "15%", flexShrink: 0 }}
  //         >
  //           Chapter {count + 1}
  //         </Typography>
  //         <Typography sx={{ flexGrow: 1 }}>{title}</Typography>
  //         <Typography
  //           sx={{ color: "text.secondary", width: "25%", flexShrink: 0 }}
  //         >
  //           {msToTime(start)} - {msToTime(end)}
  //         </Typography>
  //       </AccordionSummary>
  //       <AccordionDetails>
  //         <Typography>{summary}</Typography>
  //       </AccordionDetails>
  //     </Accordion>
  //   );
  // };

  function Accordion({ title, content, learnings }) {
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = () => setExpanded((current) => !current);

    // console.log(learnings);

    return (
      <div
        className={`border-b transition p-2 hover:bg-indigo-100 mb-4 ${
          expanded ? "bg-indigo-50" : "bg-white"
        }`}
      >
        <div
          className="accordion-header cursor-pointer transition flex space-x-5 px-5 items-center h-16 select-none"
          onClick={toggleExpanded}
        >
          {expanded ? <span>-</span> : <span>+</span>}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <div
          className={`sm:px-10 lg:px-15  pt-0 overflow-hidden transition-[max-height] duration-500 ease-in ${
            expanded ? "max-h-fit" : "max-h-0"
          }`}
        >
          {/* {learnings && (
            <div>
              <h2 style={{ color: "#8758FF", fontSize: 18, marginBottom: 5 }}>
                Key Takeaways:
              </h2>
              <ul>
                {learnings.map((learning, index) => {
                  return (
                    <li
                      style={{
                        listStyle: "outside",
                        // fontSize: 17,
                        marginBottom: 5,
                      }}
                      key={index}
                    >
                      {learning}
                    </li>
                  );
                })}
              </ul>
            </div>
          )} */}

          <p
            style={{ whiteSpace: "pre-line" }}
            className="leading-6 font-light pb-4 text-justify mt-3"
          >
            {content}
          </p>
        </div>
      </div>
    );
  }

  function AccordionWrapper() {
    // console.log(chapters);
    return (
      <div className="grid place-items-center">
        <div className="w-12/12 mx-auto rounded">
          <div className="bg-white sm:p-10 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800">
              {" "}
              Broken Down Chapter Summary{" "}
            </h3>
            <p className="text-sm font-light text-gray-600 my-1">
              Read the Chapter Summary by Simply Clicking on the Tabs for Easy
              Podcast Navigation
            </p>
            <div className="mt-10 h-1 w-full mx-auto border-b"></div>
            {chapters.map((chapter, index) => {
              return (
                <Accordion
                  key={index}
                  title={`Chapter ${index + 1}: ${chapter.title}`}
                  content={chapter.summary}
                  learnings={chapter.learnings}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AccordionWrapper chapters={chapters} />
    </div>
  );
};

export default ChaptersContainer;
