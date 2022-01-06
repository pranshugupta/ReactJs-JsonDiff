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

function parseObject(tableRows, parentKey, obj, col, className, level) {
  const openRow = { level: level, key: parentKey };
  openRow[col] = { className: className, data: '{' };
  tableRows.push(openRow);
  const childLevel = level + 1;
  Object.keys(obj).forEach((key) => {
    const td = { level: childLevel, key: key };
    td[col] = { className: className, data: obj[key] };
    tableRows.push(td);
  });
  const cloeRow = { level: level, key: parentKey };
  cloeRow[col] = { className: className, data: '}' };
  tableRows.push(cloeRow);
}
function compareObject(tableRows, parentKey, leftObj, rightObj, level) {
  if (
    (leftObj === null || leftObj === undefined) &&
    (rightObj === null || rightObj === undefined)
  )
    return;
  else if (leftObj === null || leftObj === undefined)
    parseObject(tableRows, parentKey, rightObj, 'rightCol', 'added', level);
  else if (rightObj === null || rightObj === undefined)
    parseObject(tableRows, parentKey, leftObj, 'leftCol', 'removed', level);
  else {
    const openRow = {
      level: level,
      key: parentKey,
      leftCol: { data: '{' },
      rightCol: { data: '{' },
    };
    tableRows.push(openRow);

    const leftDataKeys = Object.keys(leftObj);
    const rightDataKeys = Object.keys(rightObj);
    const allDataKeys = leftDataKeys
      .concat(rightDataKeys)
      .filter(onlyUnique)
      .sort();
    const childLevel = level + 1;
    allDataKeys.forEach((key) => {
      if (!leftObj.hasOwnProperty(key)) {
        const rightVal = rightObj[key];
        tableRows.push({
          level: childLevel,
          key: key,
          rightCol: {
            className: 'added',
            data: rightVal,
          },
        });
      } else if (!rightObj.hasOwnProperty(key)) {
        const leftVal = leftObj[key];
        tableRows.push({
          level: childLevel,
          key: key,
          leftCol: {
            className: 'removed',
            data: leftVal,
          },
        });
      } else {
        const leftVal = leftObj[key];
        const rightVal = rightObj[key];
        if (leftVal === rightVal) {
          const className = 'same';
          tableRows.push({
            level: childLevel,
            key: key,
            leftCol: {
              className: className,
              data: leftVal,
            },
            rightCol: {
              className: className,
              data: rightVal,
            },
          });
        } else {
          const className = 'modified';
          tableRows.push({
            level: childLevel,
            key: key,
            leftCol: {
              className: className,
              data: leftVal,
            },
            rightCol: {
              className: className,
              data: rightVal,
            },
          });
        }
      }
    });
    const closeRow = {
      level: level,
      key: parentKey,
      leftCol: { data: '}' },
      rightCol: { data: '}' },
    };
    tableRows.push(closeRow);
  }
}
function parseArray(tableRows, parentKey, arr, col, className, level) {
  const openRow = { level: level, key: parentKey };
  openRow[col] = { className: className, data: '[' };
  tableRows.push(openRow);
  const childLevel = level + 1;
  arr.forEach((item) => {
    const td = { level: childLevel };
    td[col] = { className: className, data: item };
    tableRows.push(td);
  });
  const cloeRow = {
    level: level,
    key: parentKey,
  };
  cloeRow[col] = { className: className, data: ']' };
  tableRows.push(cloeRow);
}
function compareArray(tableRows, parentKey, leftData, rightData, level) {
  const objClassName = 'test';
  const openRow = { level: level, key: parentKey };
  if (leftData) {
    leftData.sort();
    openRow.leftCol = { className: objClassName, data: '[' };
  }
  if (rightData) {
    rightData.sort();
    openRow.rightCol = { className: objClassName, data: '[' };
  }
  tableRows.push(openRow);
  const childLevel = level + 1;

  const allSortedArray = leftData.concat(rightData);
  allSortedArray.forEach((item) => {
    if (
      leftData &&
      leftData.includes(item) &&
      rightData &&
      rightData.includes(item)
    ) {
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
    } else if (
      leftData &&
      leftData.includes(item) &&
      (!rightData || !rightData.includes(item))
    ) {
      const className = 'removed';
      tableRows.push({
        level: childLevel,
        leftCol: {
          className: className,
          data: item,
        },
      });
    } else if (
      (!leftData || !leftData.includes(item)) &&
      rightData.includes(item)
    ) {
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

  const closeRow = { level: level };
  if (leftData) closeRow.leftCol = { className: objClassName, data: ']' };
  if (rightData) closeRow.rightCol = { className: objClassName, data: ']' };
  tableRows.push(closeRow);
}
function JsonDiff(props) {
  const { leftCaption, rightCaption, leftData, rightData } = props;
  const tableRows = [];
  compareObject(tableRows, null, leftData, rightData, 0);
  //compareArray(tableRows, null, leftData, rightData, 0);
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
