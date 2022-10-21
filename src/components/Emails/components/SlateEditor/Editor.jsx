import React, { useCallback, useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, Editable, withReact } from 'slate-react';
import Toolbar from './Toolbar/Toolbar';
import {
  sizeMap,
  fontFamilyMap,
} from './utils/SlateUtilityFunctions.js';
import withLinks from './plugins/withLinks.js';
import withTables from './plugins/withTable.js';
import withEmbeds from './plugins/withEmbeds.js';
import './Editor.css';
import Link from './Elements/Link/Link';
import Image from './Elements/Image/Image';
import Video from './Elements/Video/Video';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Button,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from '@material-tailwind/react';
import Select from 'react-select';
import _ from 'lodash';
import makeAnimated from 'react-select/animated';
import {
  checkServer,
  useCheckServer,
} from '../../../../api/hooks/useCheckServer';
import { useMutation, useQuery } from '@tanstack/react-query';
import { sendEmail } from '../../../../api/hooks/useSendEmail';

const animatedComponents = makeAnimated();

const Element = (props) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'headingOne':
      return (
        <h1 className="text-4xl" {...attributes}>
          {children}
        </h1>
      );
    case 'headingTwo':
      return (
        <h2 className="text-3xl" {...attributes}>
          {children}
        </h2>
      );
    case 'headingThree':
      return (
        <h3 className="text-2xl" {...attributes}>
          {children}
        </h3>
      );
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'alignLeft':
      return (
        <div
          style={{ textAlign: 'left', listStylePosition: 'inside' }}
          {...attributes}
        >
          {children}
        </div>
      );
    case 'alignCenter':
      return (
        <div
          style={{ textAlign: 'center', listStylePosition: 'inside' }}
          {...attributes}
        >
          {children}
        </div>
      );
    case 'alignRight':
      return (
        <div
          style={{ textAlign: 'right', listStylePosition: 'inside' }}
          {...attributes}
        >
          {children}
        </div>
      );
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'orderedList':
      return (
        <ol className="list-decimal" type="1" {...attributes}>
          {children}
        </ol>
      );
    case 'unorderedList':
      return (
        <ul className="list-disc" {...attributes}>
          {children}
        </ul>
      );
    case 'link':
      return <Link {...props} />;

    case 'table':
      return (
        <table className="w-fit">
          <tbody {...attributes}>{children}</tbody>
        </table>
      );
    case 'table-row':
      return <tr {...attributes}>{children}</tr>;
    case 'table-cell':
      return <td {...attributes}>{children}</td>;
    case 'image':
      return <Image {...props} />;
    case 'video':
      return <Video {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.strikethrough) {
    children = (
      <span style={{ textDecoration: 'line-through' }}>
        {children}
      </span>
    );
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.superscript) {
    children = <sup>{children}</sup>;
  }
  if (leaf.subscript) {
    children = <sub>{children}</sub>;
  }
  if (leaf.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>;
  }
  if (leaf.bgColor) {
    children = (
      <span style={{ backgroundColor: leaf.bgColor }}>
        {children}
      </span>
    );
  }
  if (leaf.fontSize) {
    const size = sizeMap[leaf.fontSize];
    children = <span style={{ fontSize: size }}>{children}</span>;
  }
  if (leaf.fontFamily) {
    const family = fontFamilyMap[leaf.fontFamily];
    children = <span style={{ fontFamily: family }}>{children}</span>;
  }
  return <span {...attributes}>{children}</span>;
};
const SlateEditor = ({ data }) => {
  const [subject, setSubject] = useState('');
  const [serverRunning, setServerRunning] = useState(false);
  const [successEmails, setSuccessEmails] = useState([]);
  const [failedEmails, setFailedEmails] = useState([]);
  const [recipientsNumber, setRecipientsNumber] = useState(0);
  const [Recipients, setRecipients] = useState([
    {
      value: 'all',
      label: 'All Students',
    },
  ]);
  console.log(Recipients);
  const checkServerCall = useQuery(
    ['checkServer'],
    () => checkServer(),
    {
      onSuccess: (data) => {
        setServerRunning(true);
      },
    }
  );

  const sendEmailMutation = useMutation(async (emailData) => {
    await sendEmail(emailData);
  });

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const sendEmails = async (resend) => {
    let currentRecipients = [];
    if (resend) {
      console.log('resend');
      currentRecipients = [...failedEmails];
    } else if (
      Recipients.find((recipient) => recipient.value === 'all')
    ) {
      currentRecipients = data
        .filter(
          (student) => student['Email Address'] !== 'Email Address'
        )
        .map((student) => {
          return {
            email: student['Email Address'],
          };
        });
    } else if (
      sectionNumbers
        .map((s) => s.value)
        .some((section) =>
          Recipients.map((s) => s.value).includes(section)
        )
    ) {
      // if the section number is selected
      currentRecipients = data
        .filter((student) =>
          Recipients.map((s) => s.value).includes(student.Section)
        )
        .map((student) => {
          return {
            email: student['Email Address'],
          };
        });
    } else {
      currentRecipients = Recipients.map((recipient) => {
        return {
          email: recipient.value,
        };
      });
    }
    setFailedEmails([]);
    setSuccessEmails([]);

    setRecipientsNumber(currentRecipients.length);

    for (let i = 0; i < currentRecipients.length; i++) {
      const recipient = currentRecipients[i];
      const studentData = data.find(
        (student) => student['Email Address'] === recipient.email
      );
      const emailData = {
        email: recipient.email,
        subject,
        html: html
          .replace(
            '{{STUDENT_NAME}}',
            studentData['Student Name Arabic']
          )
          .replace('{{STUDENT_EMAIL}}', recipient.email)
          .replace('{{STUDENT_ID}}', studentData['Student ID'])
          .replace('{{SERIAL_NUMBER}}', studentData['Serial No#']),
      };
      try {
        await sendEmailMutation.mutateAsync(emailData);
        setSuccessEmails((prev) => [...prev, recipient]);
      } catch (error) {
        setFailedEmails((prev) => [...prev, recipient]);
      }
      await delay(5000);
    }
  };

  let options = data.map((student) => {
    return {
      value: student['Email Address'],
      label:
        student['Email Address'] +
        ' - ' +
        student['Student Name Arabic'] +
        ' - ' +
        student['Student ID'],
    };
  });

  options = options.filter(
    (option) => option.value !== 'Email Address'
  );

  options = [
    ...options,
    { value: 'all', label: 'All Students' },
    { value: 'suspicious', label: 'Suspicious Students' },
  ];

  const dataBySection = _.groupBy(data, 'Section');

  let sectionNumbers = [];

  // Removing empty sections
  if (Object.keys(dataBySection).length > 0) {
    // remove last element
    sectionNumbers = Object.keys(dataBySection).filter(
      (section) => section !== 'Section'
    );
  } else {
    sectionNumbers = Object.keys(dataBySection);
  }

  sectionNumbers = sectionNumbers.map((section) => {
    return {
      value: section,
      label: section,
    };
  });
  options = [...options, ...sectionNumbers];

  const editor = useMemo(
    () =>
      withHistory(
        withEmbeds(withTables(withLinks(withReact(createEditor()))))
      ),
    []
  );

  const [value, setValue] = useState([
    {
      type: 'paragaph',
      children: [{ text: 'Write your email here. ' }],
    },
  ]);
  const [html, setHtml] = useState('');

  const renderElement = useCallback(
    (props) => <Element {...props} />,
    []
  );

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const serialize = (node) => {
    let attributes = '';
    if (node.color) {
      attributes += 'color: ' + node.color + ';';
    }
    if (node.bgColor) {
      attributes += 'background-color: ' + node.bgColor + ';';
    }
    if (node.fontSize) {
      attributes += 'font-size: ' + node.fontSize + ';';
    }
    if (node.fontFamily) {
      attributes += 'font-family: ' + node.fontFamily + ';';
    }

    if (node.text !== undefined) {
      let string = node.text;
      if (node.bold) {
        string =
          `<strong style={${attributes}}>` + string + '</strong>';
      }
      if (node.italic) {
        string = `<em style={${attributes}}>` + string + '</em>';
      }
      if (node.underline) {
        string = `<u style={${attributes}}>` + string + '</u>';
      }
      if (node.strikethrough) {
        string = `<s style={${attributes}}>` + string + '</s>';
      }
      if (node.superscript) {
        string = `<sup style={${attributes}}>` + string + '</sup>';
      }
      if (node.subscript) {
        string = `<sub style={${attributes}}>` + string + '</sub>';
      }
      if (node.code) {
        string = `<code style={${attributes}}>` + string + '</code>';
      }
      return string;
    }

    const children = node?.children
      ?.map((n) => serialize(n))
      .join('');

    switch (node.type) {
      case 'headingOne':
        return `<h1 className="text-4xl" style={${attributes}}>
          ${children}
        </h1>`;
      case 'headingTwo':
        return `<h2 className="text-3xl" style={${attributes}}>
          ${children}
        </h2>`;
      case 'headingThree':
        return `<h3 className="text-2xl" style={${attributes}}>
          ${children}
        </h3>`;
      case 'blockquote':
        return `<blockquote ${String(
          attributes
        )}>${children}</blockquote>`;
      case 'alignLeft':
        return `<div
          style={{ textAlign: 'left', listStylePosition: 'inside' }}
          style={${attributes}}
        >
          ${children}
        </div>`;
      case 'alignCenter':
        return `<div
          style={{ textAlign: 'center', listStylePosition: 'inside' }}
          style={${attributes}}
        >
          ${children}
        </div>`;
      case 'alignRight':
        return `<div
          style={{ textAlign: 'right', listStylePosition: 'inside' }}
          style={${attributes}}
        >
          ${children}
        </div>`;
      case 'list-item':
        return `<li style={${attributes}}>${children}</li>`;
      case 'orderedList':
        return `<ol className="list-decimal" type="1" ${String(
          attributes
        )}>
          ${children}
        </ol>`;
      case 'unorderedList':
        return `<ul className="list-disc" style={${attributes}}>
          ${children}
        </ul>`;
      case 'link':
        return `<Link style={${attributes}}/>`;
      case 'table':
        return `<table style={${attributes}} className="w-fit">
          <tbody>${children}</tbody>
        </table>`;
      case 'table-row':
        return `<tr style={${attributes}}>${children}</tr>`;
      case 'table-cell':
        return `<td style={${attributes}}>${children}</td>`;
      case 'image':
        return `<Image style={${attributes}} {...props} />`;
      case 'video':
        return `<Video style={${attributes}} {...props} />`;
      default:
        return `<p style={${attributes}}>${children}</p>`;
    }
  };

  return (
    <div className="h-full">
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          setHtml(newValue.map(serialize).join(''));
          setValue(newValue);
        }}
      >
        <Toolbar />
        <div className="flex flex-row justify-between mb-4 ">
          <div className="flex flex-row gap-6">
            <Button
              className="btnActive"
              onClick={() => {
                editor.insertText('{{STUDENT_NAME}}');
              }}
            >
              Student Name
            </Button>
            <Button
              className="btnActive"
              onClick={() => {
                editor.insertText('{{STUDENT_EMAIL}}');
              }}
            >
              Student Email
            </Button>
            <Button
              className="btnActive"
              onClick={() => {
                editor.insertText('{{SERIAL_NUMBER}}');
              }}
            >
              Serial Number
            </Button>
            <Button
              className="btnActive"
              onClick={() => {
                editor.insertText('{{STUDENT_ID}}');
              }}
            >
              Student ID
            </Button>
          </div>
          <div className="flex flex-row items-center gap-4">
            <Typography variant="h6" className="text-white">
              Templates:
            </Typography>
            <Button
              className="btnActive"
              onClick={() => {
                editor.deleteBackward(
                  'character',
                  editor.children.length
                );
                editor.insertNode([
                  {
                    type: 'paragaph',
                    children: [{ text: 'Dear {{STUDENT_NAME}},' }],
                  },
                  { type: 'paragaph', children: [{ text: '' }] },
                  {
                    type: 'paragaph',
                    children: [
                      {
                        text: 'This is just a test email to make sure that the automated email function works properly.',
                      },
                    ],
                  },
                  {
                    type: 'paragaph',
                    children: [
                      {
                        text: 'Please add this email to your contacts to ensure all future emails are sent to your inbox.',
                      },
                    ],
                  },
                  {
                    type: 'paragaph',
                    children: [
                      {
                        text: 'Please don’t send emails to this account. Use my KU email (',
                      },
                      {
                        text: 'abeer.almaimouni@ku.edu.kw',
                        bold: true,
                      },
                      { text: ')' },
                    ],
                  },
                  {
                    type: 'paragaph',
                    children: [
                      {
                        text: 'or Ms. Teams should you need to reach out to me.',
                      },
                    ],
                  },
                  { type: 'paragaph', children: [{ text: '' }] },
                  {
                    type: 'paragaph',
                    children: [
                      {
                        text: 'The coordinator of the ENGR 205 course,',
                      },
                    ],
                  },
                  {
                    type: 'paragaph',
                    children: [{ text: 'Dr. Abeer Almaimouni' }],
                  },
                ]);
              }}
            >
              1
            </Button>
          </div>
        </div>
        <input
          type="text"
          onChange={(e) => {
            setSubject(e.target.value);
          }}
          placeholder="Subject"
          className="py-4 pl-8 mb-4 rounded-md w-full"
        />
        <div
          className="editor-wrapper p-8 w-full"
          style={{ border: '1px solid #f3f3f3' }}
        >
          <Editable
            placeholder="Write something"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </div>
      </Slate>
      <Typography variant="h6" className="mt-4 text-white">
        Recipients:
      </Typography>
      <Select
        defaultValue={options.find(
          (option) => option.value === 'all'
        )}
        on
        onChange={setRecipients}
        isMulti
        components={animatedComponents}
        className="my-4 z-50"
        options={options}
      />
      <div className="flex">
        <Button
          className="btnActive mr-2"
          onClick={() => {
            checkServer.refetch();
          }}
        >
          Check Server
        </Button>
        <Button
          disabled={!serverRunning}
          onClick={() => sendEmails(false)}
          className="btnActive flex flex-row items-center gap-2"
        >
          Send
          {successEmails.length + failedEmails.length > 0 && (
            <Typography variant="h6" className="text-white">
              {successEmails.length + failedEmails.length} /{' '}
              {recipientsNumber}
            </Typography>
          )}
        </Button>
      </div>
      <Tabs
        id="emails"
        value="success"
        className="mt-4 w-1/2 mx-auto"
      >
        <TabsHeader
          className="bg-gray-700"
          indicatorProps={{
            className: 'bg-blue-500',
          }}
        >
          <Tab
            key={'success'}
            value={'success'}
            className="text-white"
          >
            Success
          </Tab>
          <Tab key={'failed'} value={'failed'} className="text-white">
            Failed
          </Tab>
        </TabsHeader>
        <TabsBody
          animate={{
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
        >
          <TabPanel key={'success'} value={'success'}>
            {successEmails.map((s) => (
              <Typography variant="body1" className="text-white">
                {s.email}
              </Typography>
            ))}
          </TabPanel>
          <TabPanel
            key={'failed'}
            value={'failed'}
            className="w-full flex flex-col"
          >
            {failedEmails.map((s) => (
              <Typography variant="body1" className="text-white">
                {s.email}
              </Typography>
            ))}
            {failedEmails.length > 0 && (
              <Button
                className="btnActive mx-auto"
                onClick={() => {
                  sendEmails(true);
                }}
              >
                Resend Emails
              </Button>
            )}
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default SlateEditor;
