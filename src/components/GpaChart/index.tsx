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

type GpaChartProps = {
  data: IStudent[];
  gpaIndex: number;
};

const GpaChart = ({ data, gpaIndex }: GpaChartProps) => {
  const dataByGpa = _.groupBy(
    data
      // @ts-ignore
      .filter((student) => student[gpaIndex] !== 'GPA')
      .map((student: any) => {
        const gpa = (student[gpaIndex] + 1) * 20;
        if (gpa >= 90) {
          return { ...student, GPA: 'A' };
        } else if (gpa >= 80) {
          return { ...student, GPA: 'B' };
        } else if (gpa >= 70) {
          return { ...student, GPA: 'C' };
        } else if (gpa >= 60) {
          return { ...student, GPA: 'D' };
        } else {
          return { ...student, GPA: 'F' };
        }
      }),
    (student: any) => student.GPA
  ) as any;

  const gpaKeys = Object.keys(dataByGpa);

  return (
    <>
      <CardHeader
        color="white"
        className="relative h-64 flex flex-row flex-wrap"
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
                color: '#F47660',
              },
              {
                id: 'Others',
                label: '',
                value: data.length - dataByGpa[gpa].length,
                color: '#E7C1A0',
              },
            ];
            return (
              <div className="w-1/6 relative h-full text-xs font-bold">
                <div className=" absolute top-28 left-1/2 -ml-2  text-2xl">
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
                  colors={{ datum: 'data.color' }}
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
                <div className="absolute bottom-8 text-center w-full flex flex-col">
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
    </>
  );
};

export default GpaChart;
