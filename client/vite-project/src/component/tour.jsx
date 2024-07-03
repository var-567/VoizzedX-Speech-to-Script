import { useState } from "react";
import "./App.css";

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tourActive, setTourActive] = useState(false);

  const steps = [
    {
      target: ".step-1",
      content: "This is the first step of the tour.",
    },
    {
      target: ".step-2",
      content: "This is the second step of the tour.",
    },
    // Add more steps as needed
  ];

  const startTour = () => {
    setCurrentStep(0);
    setTourActive(true);
  };

  const endTour = () => {
    setTourActive(false);
  };

  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const goToPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="App">
      {/* Render tour controls */}
      {!tourActive && <button onClick={startTour}>Start Tour</button>}
      {tourActive && (
        <>
          <button onClick={goToPrevStep} disabled={currentStep === 0}>
            Previous
          </button>
          <button
            onClick={goToNextStep}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </button>
          <button onClick={endTour}>End Tour</button>
        </>
      )}

      {/* Render tour content */}
      {tourActive && (
        <div className="tour-content">
          <h2>{steps[currentStep].content}</h2>
        </div>
      )}

      {/* Render target elements */}
      <div className="step-1">Step 1 Target Element</div>
      <div className="step-2">Step 2 Target Element</div>
      {/* Add more target elements for other steps */}
    </div>
  );
};

export default App;
