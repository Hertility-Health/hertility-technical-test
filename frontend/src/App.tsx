import React from 'react';
import './App.css'


interface HormoneResult {
  hormone: string;
  units: string;
  value: number;
}

interface Report {
  id: string;
  firstName: string;
  lastName: string;
  results: HormoneResult[];
}

function App() {

  return (
    <div>
      <h1>My report</h1>
     <p></p>
    </div>
  )
}

export default App
