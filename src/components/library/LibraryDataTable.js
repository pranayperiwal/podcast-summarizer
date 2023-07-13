import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Moment from "react-moment";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/components/library/LibraryDataTable.module.css";

const LibraryDataTable = ({ requests }) => {
  //   console.log(requests);
  const router = useRouter();

  function createData(
    index,
    hash,
    podcast_name,
    show_name,
    date,
    status,
    summary_url
  ) {
    return { index, hash, podcast_name, show_name, date, status, summary_url };
  }

  const rows = requests.map((item, index) => {
    return createData(
      index + 1,
      item.podcast_hash,
      item.podcast_name,
      item.show_name,
      item.date,
      item.status,
      item.summary_url
    );
  });

  const routeToRequest = (hash) => {
    // e.preventDefault();
    router.push("/library/" + hash);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 70 }}></TableCell>
            <TableCell style={{ width: 300 }}>Podcast Name</TableCell>
            <TableCell align="left">Show Name</TableCell>
            <TableCell style={{ width: 150 }} align="center">
              Date
            </TableCell>
            <TableCell style={{ width: 150 }} align="center">
              Status
            </TableCell>
            <TableCell style={{ width: 150 }} align="center">
              Summary URL
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.hash}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell scope="row">{row.index}</TableCell>
              <TableCell
                scope="row"
                onClick={() => routeToRequest(row.hash)}
                className={styles.tableRow}
              >
                {row.podcast_name}
              </TableCell>
              <TableCell
                align="left"
                // onClick={() => routeToRequest(row.hash)}
                className={styles.tableRow}
              >
                {row.show_name}
              </TableCell>
              <TableCell
                align="center"
                // onClick={() => routeToRequest(row.hash)}
                className={styles.tableRow}
              >
                <Moment format="DD-MM-YYYY" date={new Date(row.date)} />
              </TableCell>
              <TableCell
                align="center"
                // onClick={() => routeToRequest(row.hash)}
                className={styles.tableRow}
              >
                {row.status}
              </TableCell>
              <TableCell
                align="center"
                // onClick={() => routeToRequest(row.hash)}
                className={styles.tableRow}
              >
                {row.summary_url ? (
                  <div>
                    <Link
                      href={"/library/" + row.hash}
                      style={{
                        color: "var(--secondary-color)",
                        fontWeight: "bold",
                      }}
                    >
                      Summary
                    </Link>
                  </div>
                ) : (
                  <div>N/A</div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LibraryDataTable;
