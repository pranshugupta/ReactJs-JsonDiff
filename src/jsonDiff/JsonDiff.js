import React from 'react';
import './JsonDiff.css';
const stringConstructor = ''.constructor;
const arrayConstructor = [].constructor;
const objectConstructor = {}.constructor;
function jsonValueType(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
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

function compareObject(tableRows, parentKey, leftData, rightData, level) {
  const objClassName = 'test';
  const openRow = { level: level, key: parentKey };
  if (leftData) openRow.leftCol = { className: objClassName, data: '{' };
  if (rightData) openRow.rightCol = { className: objClassName, data: '{' };
  tableRows.push(openRow);
  const childLevel = level + 1;
  const oldKeys = Object.keys(leftData);
  const newKeys = Object.keys(rightData);
  const allSortedKeys = oldKeys.concat(newKeys).filter(onlyUnique).sort();
  allSortedKeys.forEach((key) => {
    if (leftData.hasOwnProperty(key) && rightData.hasOwnProperty(key)) {
      const oldVal = leftData[key];
      const newVal = rightData[key];
      if (oldVal === newVal) {
        const className = 'same';
        tableRows.push({
          level: childLevel,
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
          level: childLevel,
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
    } else if (!leftData.hasOwnProperty(key) && rightData.hasOwnProperty(key)) {
      const newVal = rightData[key];
      tableRows.push({
        level: childLevel,
        key: key,
        rightCol: {
          className: 'added',
          data: newVal,
        },
      });
    } else if (leftData.hasOwnProperty(key) && !rightData.hasOwnProperty(key)) {
      const oldVal = leftData[key];
      tableRows.push({
        level: childLevel,
        key: key,
        leftCol: {
          className: 'removed',
          data: oldVal,
        },
      });
    }
  });

  const closeRow = { level: level, key: parentKey };
  if (leftData) closeRow.leftCol = { className: objClassName, data: '}' };
  if (rightData) closeRow.rightCol = { className: objClassName, data: '}' };
  tableRows.push(closeRow);
}
function compareArray(tableRows, parentKey, leftData, rightData, level) {
  const objClassName = 'test';
  const openRow = { level: level, key: parentKey };
  if (leftData) openRow.leftCol = { className: objClassName, data: '[' };
  if (rightData) openRow.rightCol = { className: objClassName, data: '[' };
  tableRows.push(openRow);
  const childLevel = level + 1;

  const allSortedArray = leftData.concat(rightData).filter(onlyUnique).sort();
  allSortedArray.forEach((item) => {
    if (leftData.includes(item) && rightData.includes(item)) {
      const className = 'same';
      tableRows.push({
        level: childLevel,
        leftCol: {
          className: className,
          data: item,
        },
        rightCol: {
          className: className,
          data: item,
        },
      });
    } else if (leftData.includes(item) && !rightData.includes(item)) {
      const className = 'removed';
      tableRows.push({
        level: childLevel,
        leftCol: {
          className: className,
          data: item,
        },
      });
    } else if (!leftData.includes(item) && rightData.includes(item)) {
      const className = 'added';
      tableRows.push({
        level: childLevel,
        rightCol: {
          className: className,
          data: item,
        },
      });
    }
  });

  const closeRow = { level: level, key: parentKey };
  if (leftData) closeRow.leftCol = { className: objClassName, data: ']' };
  if (rightData) closeRow.rightCol = { className: objClassName, data: ']' };
  tableRows.push(closeRow);
}
function JsonDiff(props) {
  const { leftCaption, rightCaption, leftData, rightData } = props;
  const tableRows = [];
  compareObject(tableRows, null, leftData, rightData, 0);
  const rows = tableRows.map((row, index) => {
    const spacing = [];
    for (let i = 0; i < row.level; i++) {
      spacing.push(<>&emsp;&emsp;</>);
    }
    return (
      <tr key={Math.random()}>
        <td>{index + 1}</td>
        {row.leftCol ? (
          <td className={row.leftCol.className}>
            {spacing}
            {row.key && <span className="key">{row.key}:</span>}&nbsp;
            {row.leftCol.data}
          </td>
        ) : (
          <td></td>
        )}
        {row.rightCol ? (
          <td className={row.rightCol.className}>
            {spacing}
            {row.key && <span className="key">{row.key}:</span>}&nbsp;
            {row.rightCol.data}
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
