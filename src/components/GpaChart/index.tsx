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

const GpaChart = ({ data }: departmentsChartProps) => {
  const dataByGpa = _.groupBy(
    data
      // @ts-ignore
      .filter((student) => student.GPA !== 'GPA')
      .map((student) => {
        if (student.GPA >= 3.67) {
          return { ...student, GPA: 'A' };
        } else if (student.GPA >= 3) {
          return { ...student, GPA: 'B' };
        } else if (student.GPA >= 2.5) {
          return { ...student, GPA: 'C' };
        } else if (student.GPA >= 2) {
          return { ...student, GPA: 'D' };
        } else {
          return { ...student, GPA: 'F' };
        }
      }),
    'GPA'
  ) as any;
  console.log(dataByGpa);

  const gpaKeys = Object.keys(dataByGpa);
  console.log(gpaKeys);

  return (
    <Card className="w-full">
      <CardHeader
        color="white"
        className="relative h-80 flex flex-row flex-wrap"
      >
        <div className="flex flex-row flex-wrap h-full w-full gap-x-3 justify-center">
          {gpaKeys.sort().map((gpa) => {
            const chartData = [
              {
                id: gpa,
                label:
                  gpa +
                  ' ' +
                  (
                    (dataByGpa[gpa].length / data.length) *
                    100
                  ).toFixed(2) +
                  '%',
                value: dataByGpa[gpa].length,
              },
              {
                id: 'Others',
                label: '',
                value: data.length - dataByGpa[gpa].length,
              },
            ];
            return (
              <div className="w-1/6 relative">
                <div className=" absolute top-36 left-1/2 -ml-2 font-bold text-2xl">
                  {gpa}
                </div>
                <ResponsivePie
                  data={chartData}
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  startAngle={1}
                  innerRadius={0.7}
                  padAngle={0}
                  activeOuterRadiusOffset={8}
                  borderWidth={1}
                  borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]],
                  }}
                  arcLinkLabelsSkipAngle={10}
                  isInteractive={false}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  enableArcLabels={false}
                  enableArcLinkLabels={false}
                  arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]],
                  }}
                  defs={[
                    {
                      id: 'dots',
                      type: 'patternDots',
                      background: 'inherit',
                      color: 'rgba(255, 255, 255, 0.3)',
                      size: 4,
                      padding: 1,
                      stagger: true,
                    },
                    {
                      id: 'lines',
                      type: 'patternLines',
                      background: 'inherit',
                      color: 'rgba(255, 255, 255, 0.3)',
                      rotation: -45,
                      lineWidth: 6,
                      spacing: 10,
                    },
                  ]}
                  fill={[
                    {
                      match: {
                        id: gpa,
                      },
                      id: 'lines',
                    },
                  ]}
                />
                <div className="absolute bottom-12 text-center w-full flex flex-col">
                  <h1>{dataByGpa[gpa].length + ' Students'}</h1>
                  {(
                    (dataByGpa[gpa].length / data.length) *
                    100
                  ).toFixed(2) + '%'}
                </div>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-center py-3">
        <Typography
          variant="small"
          color="gray"
          className="flex gap-1"
        >
          <i className="fas fa-map-marker-alt fa-sm mt-[3px]" />
          Letter Grades Distribution Based on Students GPA
        </Typography>
      </CardFooter>
    </Card>
  );
};

export default GpaChart;
