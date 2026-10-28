import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import TrainerLogin from './TrainerLogin';
import TrainingProgram from './pages/TrainingProgram';
import BatchDetail from './pages/BatchDetail';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TrainerLogin />} />
        <Route
          path="/trainer/training"
          element={(
            <ProtectedRoute>
              <TrainingProgram />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/trainer/batch/:id"
          element={(
            <ProtectedRoute>
              <BatchDetail />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
