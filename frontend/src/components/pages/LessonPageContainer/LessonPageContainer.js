import React, { useContext, useState, useRef } from 'react'
import Button from 'react-bootstrap/esm/Button';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './LessonPageContainer.css'
import { IconContext } from 'react-icons';
import LessonPage from '../LessonPage/LessonPage';
import UserType from '../../../models/UserType';
import currentUser from '../../../config/userConfig';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import { HashLink } from 'react-router-hash-link';
import { useNavigate } from "react-router-dom";
import LessonFileSaveService from '../../../services/LessonFileHandleService';
import UserTypeSwitch from '../../miscellaneous/UserTypeSwitch/UserTypeSwitch';

const DEFINED_USER_TYPE = currentUser;
// const DEFAULT_LESSON = require('../../../assets/DefaultNewLesson.json');
// const DEFAULT_LESSON_NAME = "Nowa lekcja";

const NameHeader = ({lessonName, setLessonName, lessonDefinition}) => {
  const nameInput = useRef(null);
  const handleNameSubmit = async (e) => {
    const oldName = lessonName;
    const newName = e.currentTarget.textContent;
    setLessonName(newName);
    try {
      await LessonFileSaveService.renameLesson(oldName, newName);
      await LessonFileSaveService.saveLesson(lessonDefinition, newName);
    } catch(e) {console.log(e)}
  } 

  const handleNameChange = (e) => {
    if (e.key === 'Enter'){
      nameInput.current.blur();
    }
  }

  return (
    <div ref={nameInput} contentEditable="true" className='name-header general-button-item' onKeyDown={handleNameChange} onBlur={handleNameSubmit} suppressContentEditableWarning={true} spellCheck="false"> 
      {lessonName}
    </div>
  );
}

const LessonPageContainer = () => {
  const [userType, setUserType] = useState(currentUser);
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate();

  const showSidebar = () => setSidebar(!sidebar);

  const {lessonDefinition, lessonName, setLessonName, addPage, removePage} = useContext(LessonContext);

  const regExpNum = new RegExp("[0-9]*");

  const url = new URL(window.location.href);
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

  const handleSwitchUserType= nextChecked => {
    nextChecked ? setUserType(UserType.student) : setUserType(UserType.teacher);
  }

  const newPageEvent = () => {
    addPage();
  }

  const deletePageEvent = () => {
    removePage(currPg);
    if(lessonDefinition.pages.length >= 1) navigate(url.pathname+'/0');
    else navigate(url.pathname);
  }

  const handleSave = async () => {
    LessonFileSaveService.saveLesson(lessonDefinition, lessonName)
    .catch((e) => console.log(e));
  }
  
  // const handleNewLesson = async () => {
  //   if (lessonName !== DEFAULT_LESSON_NAME) {
  //     await handleSave();
  //   } 
  //   setLessonName(DEFAULT_LESSON_NAME);
  //   const newLessonDefinition = window.structuredClone(DEFAULT_LESSON);
  //   setLessonDefinition(newLessonDefinition);
  //   navigate(`/lesson/newLesson.json/0`, {state: {lessonFile: newLessonDefinition}});    
  // }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = lessonName+'.json';

    const file = new Blob([JSON.stringify(lessonDefinition)], { type: "text/plain" });
    link.href = URL.createObjectURL(file);

    link.click();
  }

  const handleOpen = () => {
    navigate('/');
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
          <div style={{display: 'flex'}}>
            <NameHeader lessonName={lessonName} setLessonName={setLessonName} lessonDefinition={lessonDefinition}></NameHeader>
            <Button className='general-button-item' variant='light' onClick={handleOpen}>Otwórz</Button>
            <Button className='general-button-item' variant='light' onClick={handleSave}>Zapisz</Button>
            <Button className='general-button-item' variant='light' onClick={handleDownload}>Pobierz</Button>
          </div>
          <div style={{display: 'flex', marginRight: '1em'}}>
            {DEFINED_USER_TYPE === UserType.teacher && <UserTypeSwitch handleSwitchUserType={handleSwitchUserType}/>}
            {DEFINED_USER_TYPE === UserType.teacher && <Button className='general-button-item' variant='light' onClick={newPageEvent}>Nowa strona</Button>}
            {DEFINED_USER_TYPE === UserType.teacher && <Button className='general-button-item' variant='light' disabled={lessonDefinition && lessonDefinition.pages.length === 1} onClick={deletePageEvent}>Usuń stronę</Button>}
          </div>
        </div>
      </div>
      <IconContext.Provider value={{ color: '#fff' }}>
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu-items' onClick={showSidebar}>
          <li className='navbar-toggle'>
            Pages:
          </li>
          {lessonDefinition ? lessonDefinition.pages.map((_, idx) => {
            return (
              <li key={idx} className='nav-text'>
                <Link to={url + "/" + idx}>
                  <span >{"PAGE " + (idx+1)}</span>
                </Link>
              </li>
            );
          }) : null}
        </ul>
      </nav>
      <nav className={sidebar ? 'nav-menu-inner active' : 'nav-menu-inner'}>
        <ul className='nav-menu-items' onClick={showSidebar}>
          <li className='navbar-toggle-2'>
            Sections:
          </li>
            {
              lessonDefinition ? lessonDefinition.pages[currPg].sections.map( (content, sectionIdx) => {
                return (
                  <li key={currPg*10+sectionIdx} className='nav-text-inner'>
                  <Link to={url+"/"+currPg+"/#section"+sectionIdx}>
                    <span >{content.title}</span>
                  </Link>
                </li>
                )
              })
              : null
            }
        </ul>
      </nav>
      </IconContext.Provider>
      <div className={sidebar ? 'page active' : 'page'}>
        <LessonPage userType={userType} setUserType={setUserType}/>
      </div>
    </div>
  );
}

export default LessonPageContainer;
