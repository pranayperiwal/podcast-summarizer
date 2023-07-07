import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "@/styles/components/summaries/ChaptersContainer.module.css";

const ChaptersContainer = ({ chapters }) => {
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

  const IndividualAccordian = ({ count, title, summary, start, end }) => {
    return (
      <Accordion
        expanded={expanded === "chapter" + count}
        onChange={handleChange("chapter" + count)}
        style={{ marginBottom: 10, padding: 5 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          style={{ paddingTop: 30, paddingBottom: 30 }}
        >
          <Typography
            sx={{ color: "text.secondary", width: "15%", flexShrink: 0 }}
          >
            Chapter {count + 1}
          </Typography>
          <Typography sx={{ flexGrow: 1 }}>{title}</Typography>
          <Typography
            sx={{ color: "text.secondary", width: "25%", flexShrink: 0 }}
          >
            {msToTime(start)} - {msToTime(end)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{summary}</Typography>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <div className={styles.container}>
      {chapters.map((chapter, index) => {
        return (
          <IndividualAccordian
            key={index}
            count={index}
            title={chapter.title}
            summary={chapter.summary}
            start={chapter.start}
            end={chapter.end}
          />
        );
      })}
    </div>
  );
};

export default ChaptersContainer;
