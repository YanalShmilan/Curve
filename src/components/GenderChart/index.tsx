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
import { ResponsiveBar } from '@nivo/bar';

type genderChartProps = {
  data: IStudent[];
};

const GenderChart = ({ data }: genderChartProps) => {
  const dataByGender = _.groupBy(
    data.filter(
      (student) => student['Student Gender'] !== 'Student Gender'
    ),
    'Student Gender'
  ) as any;

  const chartData = Object.keys(dataByGender).map((gender) => {
    return {
      id: gender,
      label: gender,
      value: dataByGender[gender].length,
    };
  });

  return (
    <>
      <CardHeader
        color="white"
        className="relative h-64 flex flex-row flex-wrap"
      >
        <ResponsiveBar
          data={chartData}
          indexBy="id"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          colorBy="indexValue"
          legendLabel={(datum) =>
            `${datum.data?.id} (${
              ((datum.value! / data.length) * 100).toFixed(2) + '%'
            })`
          }
          groupMode="grouped"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: '#38bcb2',
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: '#eed312',
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[]}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          legends={[
            {
              dataFrom: 'indexes',
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 105,
              translateY: 1,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 37,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          isInteractive={false}
          role="application"
        />
      </CardHeader>
      <CardFooter className="flex items-center justify-center py-3">
        <Typography
          variant="small"
          color="gray"
          className="flex gap-1"
        >
          <i className="fas fa-map-marker-alt fa-sm mt-[3px]" />
          Students Gender
        </Typography>
      </CardFooter>
    </>
  );
};

export default GenderChart;
