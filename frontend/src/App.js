import Recorder from './Components/Recorder';
import { useEffect, useState } from 'react';
import API from './api'
import './App.css'


const App = () => {
  const [list,setList] = useState([]);

  useEffect( () => { 
    API.get("/api/recordings").then(response => setList(response.data.data)).catch(e => console.log(e))
  },[]);

  return (
    <div className="bg-container">
      <h1>Amberflux Screen Recorder</h1>
      <p>Once the recording started it can only record upto 3 min</p>
      <Recorder/>
      <h2>Uploaded Recordings</h2>
      <table border="1" cellPadding="1">
        <thead>
            <tr>
              <th>Video ID</th>
              <th>Name</th>
              <th>Size</th>
              <th>File Path</th>
              <th>Created AT</th>
            </tr>
        </thead>
        <tbody>
          {
            list.map(each => (
                <tr key={each.id} onClick={() => window.open(`https://amberflux-assignment-x8xv.onrender.com/api/recordings/${each.id}`, "_blank")}>
                  <td>{each.id}</td>
                  <td>{each.filename}</td>
                  <td>{each.size}</td>
                  <td>{each.filepath}</td>
                  <td>{each.created_at}</td>
                </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App
