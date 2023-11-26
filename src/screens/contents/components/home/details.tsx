import React from 'react';
import { reportdata } from 'types/interfaces';

type Props = {
  data: reportdata[];
  displayCount: number;
};

export default function Details({ data, displayCount }: Props) {
  // Sort the data by date from the latest to the oldest
  const sortedData = data.slice().sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <>
      <div>
        <table className="details-table">
          <thead>
            <tr>
              <th>Reporter Name</th>
              <th>Incident Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedData &&
              sortedData.slice(0, displayCount).map((item: reportdata, index) => (
                <tr key={index}>
                  <td>{item.reporter}</td>
                  <td>{item.reporttype}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
