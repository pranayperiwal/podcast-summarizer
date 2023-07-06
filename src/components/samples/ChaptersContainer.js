import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "@/styles/components/samples/ChapterContainer.module.css";
import Modal from "@mui/material/Modal";

const ChaptersContainer = ({ chapters, open, handleClose }) => {
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
        className={styles.accordianContainer}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          style={{ paddingTop: 30, paddingBottom: 30 }}
        >
          <Typography className={styles.chapterIndexText}>
            Chapter {count + 1}
          </Typography>
          <Typography sx={{ flexGrow: 1, paddingRight: 5, paddingLeft: 5 }}>
            {title}
          </Typography>
          <Typography
            sx={{ color: "rgb(153, 150, 150)", width: "20%", flexShrink: 0 }}
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
      <Modal open={open} onClose={handleClose} className={styles.modal}>
        <div className={styles.modalContentContainer}>
          {chapters.map((chapter, index) => {
            return (
              <IndividualAccordian
                count={index}
                title={chapter.title}
                summary={chapter.summary}
                start={chapter.start}
                end={chapter.end}
              />
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default ChaptersContainer;
