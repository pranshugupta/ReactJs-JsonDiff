import React from 'react';
import './JsonDiff.css';
const stringConstructor = ''.constructor;
const arrayConstructor = [].constructor;
const objectConstructor = {}.constructor;
function jsonValueType(value) {
  if (value === null) return 'null';
  if (value.constructor === Boolean) return 'bool';
  if (value.constructor === Number) return 'number';
  if (value.constructor === stringConstructor) return 'string';
  if (value.constructor === arrayConstructor) return 'array';
  if (value.constructor === objectConstructor) return 'object';
  if (value.constructor === Function) return 'function';
  return '';
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function compareObject(tableRows, oldData, newData, iteration) {
  const oldKeys = Object.keys(oldData);
  const newKeys = Object.keys(newData);
  const allSortedKeys = oldKeys.concat(newKeys).filter(onlyUnique).sort();
  allSortedKeys.forEach((key) => {
    if (oldData.hasOwnProperty(key) && newData.hasOwnProperty(key)) {
      const oldVal = oldData[key];
      const newVal = newData[key];
      if (oldVal === newVal) {
        const className = 'same';
        tableRows.push({
          iteration: iteration,
          key: key,
          leftCol: {
            className: className,
            data: oldVal,
          },
          rightCol: {
            className: className,
            data: newVal,
          },
        });
      } else {
        const className = 'modified';
        tableRows.push({
          iteration: iteration,
          key: key,
          leftCol: {
            className: className,
            data: oldVal,
          },
          rightCol: {
            className: className,
            data: newVal,
          },
        });
      }
    } else if (!oldData.hasOwnProperty(key) && newData.hasOwnProperty(key)) {
      const newVal = newData[key];
      tableRows.push({
        iteration: iteration,
        key: key,
        rightCol: {
          className: 'added',
          data: newVal,
        },
      });
    } else if (oldData.hasOwnProperty(key) && !newData.hasOwnProperty(key)) {
      const oldVal = oldData[key];
      tableRows.push({
        iteration: iteration,
        key: key,
        leftCol: {
          className: 'removed',
          data: oldVal,
        },
      });
    }
  });
}
function JsonDiff(props) {
  const { leftCaption, rightCaption, leftData, rightData } = props;
  const tableRows = [];
  compareObject(tableRows, leftData, rightData, 0);

  const rows = tableRows.map((row) => {
    return (
      <tr key={Math.random()}>
        <td className="col1"></td>
        {row.leftCol ? (
          <td className={`cols ${row.leftCol.className}`}>
            <span className="key">{row.key}</span>:&nbsp;
            {JSON.stringify(row.leftCol.data)}
          </td>
        ) : (
          <td></td>
        )}
        {row.rightCol ? (
          <td className={`cols ${row.rightCol.className}`}>
            <span className="key">{row.key}</span>:&nbsp;
            {JSON.stringify(row.rightCol.data)}
          </td>
        ) : (
          <td></td>
        )}
      </tr>
    );
  });
  return (
    <table className="JsonDiffTable">
      <tbody>
        <tr>
          <th></th>
          <th>{leftCaption}</th>
          <th>{rightCaption}</th>
        </tr>
        {rows}
      </tbody>
    </table>
  );
}

export default JsonDiff;
