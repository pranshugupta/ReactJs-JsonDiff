import React from "react";
import "./JsonDiff.css";
const stringConstructor = "".constructor;
const arrayConstructor = [].constructor;
const objectConstructor = {}.constructor;
function jsonValueType(value) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (value.constructor === Boolean) return "bool";
  if (value.constructor === Number) return "number";
  if (value.constructor === stringConstructor) return "string";
  if (value.constructor === arrayConstructor) return "array";
  if (value.constructor === objectConstructor) return "object";
  if (value.constructor === Function) return "function";
  return "";
}
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function parseObject(tableRows, parentKey, obj, col, className, level) {
  const openRow = { level: level, key: parentKey };
  openRow[col] = { className: className, data: "{" };
  tableRows.push(openRow);
  const childLevel = level + 1;
  Object.keys(obj).forEach((key) => {
    const item = obj[key];
    const itemType = jsonValueType(item);
    if (itemType === "array") {
      parseArray(tableRows, parentKey, item, col, className, childLevel);
    } else if (itemType === "object") {
      parseObject(tableRows, parentKey, item, col, className, childLevel);
    } else {
      const td = { level: childLevel, key: key };
      td[col] = { className: className, data: obj[key] };
      tableRows.push(td);
    }
  });
  const closeRow = { level: level };
  closeRow[col] = { className: className, data: "}" };
  tableRows.push(closeRow);
}
function compareObject(tableRows, parentKey, leftObj, rightObj, level) {
  if (
    (leftObj === null || leftObj === undefined) &&
    (rightObj === null || rightObj === undefined)
  )
    return;
  else if (leftObj === null || leftObj === undefined)
    parseObject(tableRows, parentKey, rightObj, "rightCol", "added", level);
  else if (rightObj === null || rightObj === undefined)
    parseObject(tableRows, parentKey, leftObj, "leftCol", "removed", level);
  else {
    const openRow = {
      level: level,
      key: parentKey,
      leftCol: { data: "{" },
      rightCol: { data: "{" },
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
        const rightValType = jsonValueType(rightVal);
        if (rightValType === "array") {
          parseArray(tableRows, key, rightVal, "rightCol", "added", childLevel);
        } else if (rightValType === "object") {
          parseObject(
            tableRows,
            key,
            rightVal,
            "rightCol",
            "added",
            childLevel
          );
        } else
          tableRows.push({
            level: childLevel,
            key: key,
            rightCol: {
              className: "added",
              data: rightVal,
            },
          });
      } else if (!rightObj.hasOwnProperty(key)) {
        const leftVal = leftObj[key];
        const leftValType = jsonValueType(leftVal);
        if (leftValType === "array") {
          parseArray(tableRows, key, leftVal, "leftCol", "removed", childLevel);
        } else if (leftValType === "object") {
          parseObject(
            tableRows,
            key,
            leftVal,
            "leftCol",
            "removed",
            childLevel
          );
        } else
          tableRows.push({
            level: childLevel,
            key: key,
            leftCol: {
              className: "removed",
              data: leftVal,
            },
          });
      } else {
        const leftVal = leftObj[key];
        const rightVal = rightObj[key];
        const leftValType = jsonValueType(leftVal);
        const rightValType = jsonValueType(rightVal);
        let valType;
        if (leftValType === rightValType) {
          valType = leftValType;
        } else {
          if (leftValType === "array" || rightValType === "array")
            valType = "array";
          else if (leftValType === "object" || rightValType === "object")
            valType = "object";
          else valType = "string";
        }
        if (valType === "array") {
          compareArray(tableRows, key, leftVal, rightVal, childLevel);
        } else if (valType === "object") {
          compareObject(tableRows, key, leftVal, rightVal, childLevel);
        } else {
          if (leftVal === rightVal) {
            const className = "same";
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
            const className = "modified";
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
      }
    });
    const closeRow = {
      level: level,
      leftCol: { data: "}" },
      rightCol: { data: "}" },
    };
    tableRows.push(closeRow);
  }
}
function parseArray(tableRows, parentKey, arr, col, className, level) {
  const openRow = { level: level, key: parentKey };
  openRow[col] = { className: className, data: "[" };
  tableRows.push(openRow);
  const childLevel = level + 1;
  arr.forEach((item) => {
    const itemType = jsonValueType(item);
    if (itemType === "array") {
      parseArray(tableRows, "", item, col, className, childLevel);
    } else if (itemType === "object") {
      parseObject(tableRows, "", item, col, className, childLevel);
    } else {
      const td = { level: childLevel };
      td[col] = { className: className, data: item };
      tableRows.push(td);
    }
  });
  const closeRow = { level: level };
  closeRow[col] = { className: className, data: "]" };
  tableRows.push(closeRow);
}
function compareArray(tableRows, parentKey, leftArr, rightArr, level) {
  if (
    (leftArr === null || leftArr === undefined) &&
    (rightArr === null || rightArr === undefined)
  )
    return;
  else if (leftArr === null || leftArr === undefined)
    parseArray(tableRows, parentKey, rightArr, "rightCol", "added", level);
  else if (rightArr === null || rightArr === undefined)
    parseArray(tableRows, parentKey, leftArr, "leftCol", "removed", level);
  else {
    const openRow = {
      level: level,
      key: parentKey,
      leftCol: { data: "[" },
      rightCol: { data: "[" },
    };
    tableRows.push(openRow);

    leftArr.sort();
    rightArr.sort();

    const childLevel = level + 1;
    while (leftArr.length > 0) {
      const leftItem = leftArr[0];
      const leftItemType = jsonValueType(leftItem);
      if (leftItemType === "array") {
        parseArray(tableRows, "", leftItem, "leftCol", "removed", childLevel);
        leftArr.splice(0, 1);
      } else if (leftItemType === "object") {
        parseObject(tableRows, "", leftItem, "leftCol", "removed", childLevel);
        leftArr.splice(0, 1);
      } else {
        const rightItemIndex = rightArr.indexOf(leftItem);
        if (rightItemIndex !== -1) {
          const className = "same";
          tableRows.push({
            level: childLevel,
            leftCol: {
              className: className,
              data: leftItem,
            },
            rightCol: {
              className: className,
              data: leftItem,
            },
          });
          leftArr.splice(0, 1);
          rightArr.splice(rightItemIndex, 1);
        } else {
          const className = "removed";
          tableRows.push({
            level: childLevel,
            leftCol: {
              className: className,
              data: leftItem,
            },
          });
          leftArr.splice(0, 1);
        }
      }
    }
    while (rightArr.length > 0) {
      const rigthItem = rightArr[0];
      const rightItemType = jsonValueType(rigthItem);
      const className = "added";
      if (rightItemType === "array") {
        parseArray(tableRows, "", rigthItem, "rightCol", className, childLevel);
        rightArr.splice(0, 1);
      } else if (rightItemType === "object") {
        parseObject(
          tableRows,
          "",
          rigthItem,
          "rightCol",
          className,
          childLevel
        );
        rightArr.splice(0, 1);
      } else
        tableRows.push({
          level: childLevel,
          rightCol: {
            className: className,
            data: rigthItem,
          },
        });
      rightArr.splice(0, 1);
    }
    const closeRow = {
      level: level,
      leftCol: { data: "]" },
      rightCol: { data: "]" },
    };
    tableRows.push(closeRow);
  }
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
