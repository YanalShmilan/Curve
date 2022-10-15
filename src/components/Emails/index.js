import React from 'react';
import Editor from './components/SlateEditor/Editor';

type Props = {
  data: IStudent[],
};

const Emails = ({ data }: Props) => {
  return (
    <div>
      <Editor data={data} />
    </div>
  );
};

export default Emails;
