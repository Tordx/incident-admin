import React, { useEffect, useState } from 'react';
import { months } from 'screens/contents/constants/months';
import { BarChart } from '@mui/x-charts';
import { reportdata, userdata } from 'types/interfaces';
import { fetchdata, fetchusers } from '../../../../firebase/function';

type Props = {
  year: string;
};

function Chart({ year }: Props) {
  const [incidentdata, setincidentdata] = useState<reportdata[]>([]);
  const [resident, setresident] = useState<userdata[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result: userdata[] = await fetchusers() || [];
        const residentdata = result.filter((item) => {
          const itemYear = item.createdate?.split('/')[2]; // Extract the year part
          return item.type === 'user' && itemYear === year;
        });
        setresident(residentdata);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchData = async () => {
      try {
        const result: reportdata[] = await fetchdata('incident', true) || [];

        const incidentDataByYear = result.filter((item) => {
          const itemYear = item.date?.split('/')[2];
          return itemYear === year;
        });
        setincidentdata(incidentDataByYear);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    fetchUsers();
  }, [year]);

  const accumulateDataByMonth = (data: any[]) => {
    const monthData = new Array(12).fill(0);

    data.forEach((item) => {
      if (item.date !== undefined) {
        const dateParts = item.date.split('/'); // Assuming date is in the format MM-DD-YYYY
        const month = parseInt(dateParts[0], 10) - 1; // Adjust month index (0-based)

        monthData[month] += 1;
      }
    });

    return monthData;
  };

  const residentCount = accumulateDataByMonth(resident);
  const incidentCount = accumulateDataByMonth(incidentdata);

  return (
    <>
      <BarChart
        xAxis={[{ scaleType: 'band', data: months }]}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: -50,
          },
        }}
        series={[
          
          { data: incidentCount, label: 'incident per month', color: 'red'},
          { data: residentCount, label: 'new users', color: 'green'},
        ]}
        width={750}
        height={400}
      />
    </>
  );
}

export default Chart;
