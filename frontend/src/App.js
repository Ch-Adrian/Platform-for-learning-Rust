import './App.css';
import HomePage from './components/pages/HomePage/HomePage';
import Layout from './components/pages/Layout/Layout';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  LessonContextProvider  from './contexts/LessonContext/LessonContextProvider';
import LessonPageContainer from './components/pages/LessonPageContainer/LessonPageContainer';

function App() {
  return (
    <BrowserRouter>
      <LessonContextProvider>
        <Routes>
          <Route path='/' element={<Layout />} >
            <Route index element={<HomePage />} />  
            <Route path="lesson/:name/:page" element={<LessonPageContainer />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </LessonContextProvider>
      
    </BrowserRouter>
  );
}

export default App;
