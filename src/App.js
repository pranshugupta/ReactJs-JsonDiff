import React from 'react';
import './style.css';
import JsonDiff from './jsonDiff/JsonDiff';
export default function App() {
  const leftArray = ['two', 'one', 'one'];
  const rightArray = ['three', 'one'];
  const leftObject = null;
  const rightObject = {
    strings: 'John',
  };
  return (
    <JsonDiff
      leftCaption="Old Data"
      leftData={leftObject}
      rightCaption="New Data"
      rightData={rightObject}
    />
  );
}
