import React, { useEffect, useState } from 'react';
import { months } from 'screens/contents/constants/months';
import { BarChart } from '@mui/x-charts';
import { reportdata, userdata } from 'types/interfaces';
import { fetchdata, fetchreport, fetchusers } from '../../../../firebase/function';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

type Props = {
  year: string;
  infodata: string,
  actual: string,
};

function IndividualChart({ infodata, actual, year }: Props) {
  const [data, setdata] = useState<reportdata[]>([]);
  useEffect(() => {

    const fetchData = async () => {
      try {
        const Accidents: reportdata[] = await fetchreport('incident', infodata) || [];

        const accidentresult = Accidents.filter((item) => {
          const itemYear = item.date?.split('/')[2];
          return itemYear === year;
        });

        const filterIncidentType: reportdata[] = accidentresult
        .filter((item) => item.actualincident === actual);
        setdata(filterIncidentType)

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    
  }, [year]);

  const accumulateDataByMonth = (data: any[]) => {
    const monthData = new Array(12).fill(0);

    data.forEach((item) => {
      if (item.date !== undefined) {
        const dateParts = item.date.split('/'); 
        const month = parseInt(dateParts[0], 10) - 1;

        monthData[month] += 1;
      }
    });

    return monthData;
  };

  const processeddata = accumulateDataByMonth(data);

  const handleChart = async() => {
    const chartContainer = document.getElementById('ind-container');

    if (chartContainer) {
      try {
        const canvas = await html2canvas(chartContainer);
        const dataURL = canvas.toDataURL('image/png');
  
        const printWindow = window.open('', infodata);
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${infodata}</title>
              </head>
              <body>
                <img src="${dataURL}" alt="Chart" alt="Chart" width="100%" />
                <script>
                  window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                      printWindow.close();
                    };
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      } catch (error) {
        console.error('Error capturing chart screenshot:', error);
      }
    }
  };


  return (
    <><a onClick={handleChart} style={{color: '#87CEEB'}}><FontAwesomeIcon icon={faPrint} color = '#87CEEB' /> download Chart</a>
    <div id = 'ind-container'>
      
      <BarChart
        xAxis={[{ scaleType: 'band', data: months }]}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: -30
            
          },
          
        }}
        series={[
          
          { data: processeddata, label: actual, color: '#FE0000'},
        ]}
        width={1500}
        height={300}
      />
    </div>
    </>
  );
}

export default IndividualChart;
