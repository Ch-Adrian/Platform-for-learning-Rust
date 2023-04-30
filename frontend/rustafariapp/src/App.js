import './App.css';
import LessonPage from './components/pages/LessonPage/LessonPage';
import HomePage from './components/pages/HomePage/HomePage';
import Layout from './components/pages/Layout/Layout';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route index element={<HomePage />} />  
          <Route path="lesson/:name/:page" element={<LessonPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
