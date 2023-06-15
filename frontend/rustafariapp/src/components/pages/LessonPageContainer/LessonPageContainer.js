import React, { useContext, useState } from 'react'
import Button from 'react-bootstrap/esm/Button';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './LessonPageContainer.css'
import { IconContext } from 'react-icons';
import LessonPage from '../LessonPage/LessonPage';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import { HashLink } from 'react-router-hash-link';
import { useNavigate } from "react-router-dom";
import LessonFileHandleService from '../../../services/LessonFileHandleService';

const DEFAULT_LESSON = require('../../../assets/DefaultNewLesson.json');
const DEFAULT_LESSON_NAME = "Nowa lekcja";

const LessonPageContainer = () => {
  
  const [sidebar, setSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const showSidebar = () => setSidebar(!sidebar);

  const {lessonDefinition, setLessonDefinition, lessonName, setLessonName} = useContext(LessonContext);

  const regExpNum = new RegExp("[0-9]*");

  console.log(lessonDefinition)
  
  const url = new URL(window.location.href);
  console.log(url);
  let path = url.pathname.split("/");
  let currPg = 0; 

  while(true){
    let word = path.pop();
    if(regExpNum.test(word)){
      currPg = parseInt(word);
    }
    if(path.at(path.length-1).indexOf(".json") !== -1){
      break;
    }
  }

  const newPageEvent = () => {
    let newLessonDefinition = {...lessonDefinition};
    newLessonDefinition.pages.push({ sections: [] });

    setLessonDefinition(newLessonDefinition);
  }

  const deletePageEvent = () => {
    let newLessonDefinition = {...lessonDefinition};
    newLessonDefinition.pages.splice(currPg, 1);

    setLessonDefinition(newLessonDefinition);

    if(lessonDefinition.pages.length >= 1) navigate(url.pathname+'/0');
    else navigate(url.pathname);
  }

  const handleSave = async () => {
    LessonFileHandleService.saveLesson(lessonDefinition, lessonName);
  }
  
  const handleNewLesson = async () => {
    if (lessonName !== DEFAULT_LESSON_NAME) {
      await handleSave();
    } 
    setLessonName(DEFAULT_LESSON_NAME);
    const newLessonDefinition = window.structuredClone(DEFAULT_LESSON);
    setLessonDefinition(newLessonDefinition);
    navigate(`/lesson/newLesson.json/0`, {state: {lessonFile: newLessonDefinition}});    
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = lessonName+'.json';

    const file = new Blob([JSON.stringify(lessonDefinition)], { type: "text/plain" });
    link.href = URL.createObjectURL(file);

    link.click();
  }

  url.pathname = path.join("/")
  localStorage.setItem(lessonDefinition, lessonDefinition);

  return (
    <div className='sidebar'>
      <div className='top-menu-bar'>
        <Link to='#' className='menu-bars'>
          <FaIcons.FaBars className='hamburger' onClick={showSidebar} />
        </Link>
        <div className='general-buttons'>
          <div>
            <Button className='general-button-item' variant='light' onClick={handleNewLesson}>Nowa</Button>
            <Button className='general-button-item' variant='light' onClick={handleSave}>Zapisz</Button>
            <Button className='general-button-item' variant='light' onClick={handleDownload}>Pobierz</Button>
          </div>
          <div>
            <Button className='general-button-item' variant='light' onClick={newPageEvent}>Nowa strona</Button>
            <Button className='general-button-item' variant='light' disabled={lessonDefinition && lessonDefinition.pages.length == 1} onClick={deletePageEvent}>Usuń stronę</Button>
          </div>
        </div>
      </div>
      <IconContext.Provider value={{ color: '#fff' }}>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              Pages:
            </li>
            {lessonDefinition && lessonDefinition.pages.map((_, idx) => {
              return (
                <li key={idx} className='nav-text'>
                  <Link to={url + "/" + idx}>
                    <span >{"PAGE " + idx}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <nav className={sidebar ? 'nav-menu-inner active' : 'nav-menu-inner'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              Sections:
            </li>
              {
                lessonDefinition && lessonDefinition.pages[currPg].sections.map( (content, sectionIdx) => {
                  return (
                    <HashLink key={currPg*10+sectionIdx} to={url+"/"+currPg+"/#section"+sectionIdx}>
                      <li key={sectionIdx} className='nav-text-inner' >{
                        <span>{content.title}</span>
                      }
                      </li>
                    </HashLink>
                  )
                })
              }

          </ul>
        </nav>
      </IconContext.Provider>
      <div className={sidebar ? 'page active' : 'page'}>
        <LessonPage/>
      </div>
        
      
      
    </div>
  );
}

export default LessonPageContainer;
