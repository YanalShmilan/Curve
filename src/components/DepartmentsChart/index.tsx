// Interfaces
import IStudent from '../../interfaces/IStudent';

// Components
import {
  Card,
  CardHeader,
  CardFooter,
  Typography,
} from '@material-tailwind/react';

// Utils
import _ from 'lodash';

// Chart
import { ResponsivePie } from '@nivo/pie';

type departmentsChartProps = {
  data: IStudent[];
};

const DepartmentsChart = ({ data }: departmentsChartProps) => {
  const dataByDepartment = _.groupBy(
    data.filter((student) => student.Major !== 'Major'),
    'Major'
  ) as any;

  const chartData = Object.keys(dataByDepartment).map(
    (department) => {
      return {
        id: department,
        label:
          department +
          ' ' +
          (
            (dataByDepartment[department].length / data.length) *
            100
          ).toFixed(2) +
          '%',
        value: dataByDepartment[department].length,
      };
    }
  );

  return (
    <>
      <CardHeader
        color="white"
        className="relative h-80 flex flex-row flex-wrap"
      >
        <ResponsivePie
          data={chartData}
          margin={{ top: 80, right: 80, bottom: 80, left: -50 }}
          innerRadius={0.5}
          startAngle={1}
          padAngle={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 2]],
          }}
          legends={[
            {
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 50,
              translateY: 0,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 30,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
        />
      </CardHeader>
      <CardFooter className="flex items-center justify-center py-3">
        <Typography
          variant="small"
          color="gray"
          className="flex gap-1"
        >
          <i className="fas fa-map-marker-alt fa-sm mt-[3px]" />
          Number of Students From Each Department
        </Typography>
      </CardFooter>
    </>
  );
};

export default DepartmentsChart;
