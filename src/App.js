import React from 'react';
import './style.css';
import JsonDiff from './jsonDiff/JsonDiff';
export default function App() {
  const leftArray = [];
  const rightArray = ['two', 'one', 'one'];
  const leftObject = {
    strings: 'John',
  };
  const rightObject = null;
  return (
    <JsonDiff
      leftCaption="Old Data"
      leftData={leftArray}
      rightCaption="New Data"
      rightData={rightArray}
    />
  );
}
