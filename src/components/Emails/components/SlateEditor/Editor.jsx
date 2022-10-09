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
import { Button } from '@material-tailwind/react';

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
const SlateEditor = () => {
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

  console.log(html);
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => {
        setHtml(newValue.map(serialize).join(''));
        setValue(newValue);
      }}
    >
      <Toolbar />
      <div className="flex flex-row mb-4 gap-6">
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
  );
};

export default SlateEditor;
