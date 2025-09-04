import { useState, useRef } from 'react';
import API from '../../api'
import './index.css'

const Recorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [timer, setTimer] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const chunks = useRef([]);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const start = async () => {
    try {
     
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });


      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...screenStream.getAudioTracks(),
        ...audioStream.getAudioTracks()   
      ]);

      const recorder = new MediaRecorder(combinedStream);

      recorder.ondataavailable = e => chunks.current.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setRecordedBlob(blob);
        chunks.current = [];
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
        setTimer(0);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);

      setTimer(0);
      intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);

      timeoutRef.current = setTimeout(() => {
        stop();
      }, 180 * 1000); 
    } catch (e) {
      alert(e);
    }
  };

  const stop = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    setRecording(false);
  };

  const resetDefaults = () => {
    setVideoUrl(null);
    setRecordedBlob(null);
    setTimer(0);
    setRecording(false);
    setMediaRecorder(null);
  };

  const upload = async () => {
    if (!recordedBlob) {
      alert("No recording available to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("video", recordedBlob, "recording.webm");

    try {
      const res = await API.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log("Upload success:", res.data);
      alert("Upload successful!");
      resetDefaults();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed!");
    }
  };

  return (
    <>
      {!recording && !videoUrl && (
        <button onClick={start}>Start</button>
      )}
      {recording && <button onClick={stop}>Stop</button>}

      {recording && (
        <div>
          Recording... {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')} / 3:00
        </div>
      )}

      {videoUrl && (
        <>
          <video src={videoUrl} controls className='video-player' />
          <div className='video-btn-container'>
            <a href={videoUrl} download="recording.webm" className="btn">Download</a>
            <button onClick={upload} className="btn">Upload</button>
          </div>
        </>
      )}
    </>
  );
};

export default Recorder;
