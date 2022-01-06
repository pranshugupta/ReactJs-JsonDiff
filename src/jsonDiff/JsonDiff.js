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
  return 'Not sure what it is';
}
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
// const oldValue = {
//   one: null,
//   two: undefined,
//   three: "John",
//   four: ["test", "test1"],
//   five: { blah: "blue" },
//   six: true,
//   seven: 12,
//   eight() {
//     return `{name: "${this.name}", age: ${this.age}}`;
//   },
// };
// const newValue = {
//   Pone: null,
//   two: undefined,
//   Cthree: "John",
//   four: ["test1", "test1"],
//   five: { blah: "blue" },
//   Ssix: true,
//   seven: 124,
//   eight() {
//     return `{name: "${this.name}", age: ${this.age}}`;
//   },
// };
const oldValue = {
  one: 'One',
};
const newValue = {
  one: 'One',
};
const tableRows = [];
function compareObject(oldData, newData, iteration) {
  const oldKeys = Object.keys(oldData);
  const newKeys = Object.keys(newData);
  const allSortedKeys = oldKeys.concat(newKeys).filter(onlyUnique).sort();

  allSortedKeys.forEach((key) => {
    if (oldData[key] && newData[key]) {
      const oldVal = oldData[key];
      const newVal = newData[key];
      const oldValType = jsonValueType(oldVal);
      const newValType = jsonValueType(newVal);
      if (oldValType === newValType) {
        if (oldVal === newVal) {
          tableRows.push({
            type: 'same',
            leftCol: oldVal,
            rightCol: newVal,
            iteration: iteration,
          });
        }
      }
    } else if (!oldData[key] && newData[key]) {
    } else if (oldData[key] && !newData[key]) {
    }
  });
}
function JsonDiff() {
  compareObject(oldValue, newValue, 0);
  const rows = tableRows.map((row) => {
    return (
      <tr key={Math.random()}>
        <td className="col1"></td>
        <td className="cols">{row.leftCol}</td>
        <td className="cols">{row.rightCol}</td>
      </tr>
    );
  });
  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>OldData</th>
          <th>Newdata</th>
        </tr>
        {rows}
      </tbody>
    </table>
  );
}

export default JsonDiff;
