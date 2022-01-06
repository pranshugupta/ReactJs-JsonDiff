import React from 'react';
import './style.css';
import JsonDiff from './jsonDiff/JsonDiff';
export default function App() {
  const leftArray = ['one', 'two', 'three', 'one'];
  const rightArray = ['one', 'two', 'Four', 'two'];
  const leftObject = {
    leftArray: leftArray,
    // strings: 'John',
    // nulls: null,
    // booleans: true,
    // numbers: 12,
    // strings: 'John',
  };
  const rightObject = {
    rightArray: rightArray,
    // strings: 'John1',
    // nulls: null,
    // booleans: true,
    // numbers: 12,
    // strings: 'John',
  };
  return (
    <JsonDiff
      leftCaption="Old Data"
      leftData={leftArray}
      rightCaption="New Data"
      rightData={rightArray}
    />
  );
}
