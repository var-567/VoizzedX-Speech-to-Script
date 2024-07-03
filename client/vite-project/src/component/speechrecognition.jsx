import { useState } from "react";
import axios from "axios";
import { firestore } from "./firebase";

function SpeechRecog() {
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  let mediaRecorder;

  const startRecording = () => {
    setError(null);
    setTranscript("");
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        const audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          setAudioBlob(audioBlob);
        });
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
        setError("Error accessing microphone");
        setIsRecording(false);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder.stop();
  };

  const uploadAudio = () => {
    if (!audioBlob) {
      setError("No audio recorded");
      return;
    }
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");

    axios
      .post("http://localhost:5000/api/recognize", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const recognizedText = response.data.text;
        setTranscript(recognizedText);

        // Save the recognized text to Firebase Firestore
        firestore
          .collection("transcripts")
          .add({
            text: recognizedText,
            timestamp: new Date(),
          })
          .then(() => {
            console.log("Transcript saved to Firestore");
          })
          .catch((error) => {
            console.error("Error saving transcript to Firestore:", error);
            setError("Error saving transcript to Firestore");
          });
      })
      .catch((error) => {
        console.error("Error uploading audio:", error);
        setError("Error uploading audio");
      });
  };

  return (
    <div className="App">
      <h1>Speech Recognition</h1>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <button onClick={uploadAudio} disabled={!audioBlob}>
        Upload Audio
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Transcript</h2>
      <p>{transcript}</p>
    </div>
  );
}

export default SpeechRecog;
