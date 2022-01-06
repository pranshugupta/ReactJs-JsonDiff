import React from 'react';
import './style.css';
import JsonDiff from './jsonDiff/JsonDiff';
export default function App() {
  const leftData = {
    strings: 'John',
    nulls: null,
    booleans: true,
    numbers: 12,
    strings: 'John',
    arrays1: ['test1', 'test1'],
    //objects: { blah: 'blue' },
  };
  const rightData = {
    strings: 'John1',
    nulls: null,
    booleans: true,
    numbers: 12,
    strings: 'John',
    arrays: ['test1', 'test1'],
    //objects: { blah: 'blue' },
  };
  return (
    <JsonDiff
      leftCaption="Old Data"
      leftData={leftData}
      rightCaption="New Data"
      rightData={rightData}
    />
  );
}
