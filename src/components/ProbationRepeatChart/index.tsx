// Components
import {
  Card,
  CardHeader,
  CardFooter,
  Typography,
} from '@material-tailwind/react';

// Utils
import _ from 'lodash';
import cx from 'classnames';

// Interfaces
import IStudent from '../../interfaces/IStudent';

type probationRepeatChartProps = {
  data: IStudent[];
};

const ProbationRepeatChart = ({
  data,
}: probationRepeatChartProps) => {
  const probation = _.groupBy(
    // @ts-ignore
    data.map((student) =>
      // @ts-ignore
      student['Probation Count'] !== ''
        ? student
        : (student['Probation Count'] = 0)
    ),
    'Probation Count'
  ) as any;

  const probationKeys =
    Object.keys(probation).length > 1
      ? Object.keys(probation).slice(0, -1)
      : Object.keys(probation);

  const repeat = _.groupBy(
    // @ts-ignore
    data.map((student) =>
      // @ts-ignore
      student['Repeat Count'] !== ''
        ? student
        : (student['Repeat Count'] = 0)
    ),
    'Repeat Count'
  ) as any;

  const repeatKeys =
    Object.keys(repeat).length > 1
      ? Object.keys(repeat).slice(0, -1)
      : Object.keys(repeat);

  return (
    <>
      <CardHeader color="white" className="relative h-80">
        <div className="flex flex-col justify-evenly h-full ml-2">
          <div className="flex flex-row gap-1">
            <h1
              className="transform rotate-180 font-bold"
              style={{ writingMode: 'vertical-rl' }}
            >
              Repeat
            </h1>
            {repeatKeys.map((item: any, index: number) => {
              return (
                <Card
                  key={index}
                  className={cx(
                    `w-16 h-16 pt-1 rounded-tr-none rounded-bl-none`,
                    {
                      'bg-red-50': index == 0,
                      'bg-red-100': index == 1,
                      'bg-red-200': index == 2,
                      'bg-red-300': index == 3,
                      'bg-red-400': index == 4,
                      'bg-red-500': index == 5,
                      'bg-red-600': index == 6,
                      'bg-red-700': index == 7,
                      'bg-red-800': index == 8,
                      'bg-red-900': index == 9,
                    }
                  )}
                >
                  <div className="flex flex-col h-full w-full items-start px-4 text-sm">
                    <h1 className="font-bold ">{item}</h1>
                    <h1 className="font-bold self-center">
                      {(
                        repeat[item].length /
                        (data.length - 1)
                      ).toFixed(2) + '%'}
                    </h1>
                    <h1 className="font-bold self-center">
                      {repeat[item].length}
                    </h1>
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="flex flex-row gap-1 w-full">
            <h1
              className="transform rotate-180 font-bold"
              style={{ writingMode: 'vertical-rl' }}
            >
              Probation
            </h1>
            {probationKeys.map((item: any, index: number) => {
              return (
                <Card
                  key={index}
                  className={cx(
                    `w-16 h-16 rounded-tr-none rounded-bl-none`,
                    {
                      'bg-red-50': index == 0,
                      'bg-red-100': index == 1,
                      'bg-red-200': index == 2,
                      'bg-red-300': index == 3,
                      'bg-red-400': index == 4,
                      'bg-red-500': index == 5,
                      'bg-red-600': index == 6,
                      'bg-red-700': index == 7,
                      'bg-red-800': index == 8,
                      'bg-red-900': index == 9,
                    }
                  )}
                >
                  <div className="flex flex-col h-full w-full items-start mt-1 px-4 text-sm">
                    <h1 className="font-bold">{item}</h1>
                    <h1 className="font-bold self-center">
                      {(
                        (probation[item].length / (data.length - 1)) *
                        100
                      ).toFixed(2) + '%'}
                    </h1>
                    <h1 className="font-bold self-center">
                      {probation[item].length}
                    </h1>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-center py-3">
        <Typography
          variant="small"
          color="gray"
          className="flex gap-1"
        >
          <i className="fas fa-map-marker-alt fa-sm mt-[3px]" />
          Students Repeat and Probation Count
        </Typography>
      </CardFooter>
    </>
  );
};

export default ProbationRepeatChart;
