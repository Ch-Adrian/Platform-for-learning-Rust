'use client'

import React, { useContext, useState, useRef, useEffect, useCallback } from 'react'
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
import ConfigModal from '../../Modals/ConfigModal/ConfigModal';
import CodeExecutorService from '../../../services/CodeExecutorService';
import LessonSaveModal from '../../Modals/LessonSaveModal/LessonSaveModal';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error }) => (
  <div item-cy="render-errror-message" style={{color: "red"}}>
    <h2>Błąd podczas renderowania lekcji</h2>
    <p>Treść błędu: {error.message}</p>
  </div>
);


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
    <div data-cy="lesson-name" ref={nameInput} contentEditable="true" className='name-header general-button-item' onKeyDown={handleNameChange} onBlur={handleNameSubmit} suppressContentEditableWarning={true} spellCheck="false"> 
      {lessonName}
    </div>
  );
}

const LessonPageContainer = () => {
  const [userType, setUserType] = useState(currentUser);
  const [sidebar, setSidebar] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [saveLessonModalOpen, setSaveLessonModalOpen] = useState(false);
  const [isCargoCompiled, setIsCargoCompiled] = useState(true);
  const [isCargoError, setIsCargoError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const navigate = useNavigate();
  // const { ErrorBoundary, didCatch, error } = useErrorBoundary();

  const showSidebar = () => setSidebar(!sidebar);

  const {lessonDefinition, lessonName, setLessonName, addPage, removePage, updateCargoToml} = useContext(LessonContext);
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

  const handleSaveConfig =  useCallback( async (configContent) => {
    setConfigModalOpen(false);
    setIsCargoCompiled(false);
    setIsCargoError(false);
    
    await CodeExecutorService.buildCargo(configContent)
    .then((res) => {
      updateCargoToml(configContent);
    })
    .catch((err) => {
      setIsCargoError(true);
      console.log(err);
    });
    setIsCargoCompiled(true);
  }, [updateCargoToml])

  const onLoadBuild = useCallback(() => {
    if (!hasLoaded && lessonDefinition) {
      handleSaveConfig(lessonDefinition.cargoToml);
      setHasLoaded(true);
    }
  }, [hasLoaded, lessonDefinition, handleSaveConfig])

  useEffect(() => {
    onLoadBuild()
  }, [onLoadBuild, hasLoaded])

  const handleSaveAndExit = async () => {
    await handleSave();
    setSaveLessonModalOpen(false)
    handleOpen();
  }

  // if (didCatch) {
  //   console.error(error);
  //   return <ErrorFallback />;
  // }

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
              <Button data-cy="back-button" className='general-button-item' variant='light' onClick={() => setSaveLessonModalOpen(true)}>Wróć</Button>
              <Button data-cy="save-button" className='general-button-item' variant='light' onClick={handleSave}>Zapisz</Button>
              <Button className='general-button-item' variant='light' onClick={handleDownload}>Pobierz</Button>
              <div className='status-info'>
                {isCargoError ? <p>Error building project! Check cargo file</p> : null}
                {!isCargoCompiled ? <p>Budowanie projektu...</p> : null}
                {isCargoCompiled && !isCargoError ? <p>Gotowe</p> : null}
              </div>
            </div>
            <div style={{display: 'flex', marginRight: '1em'}}>
              {DEFINED_USER_TYPE === UserType.teacher && <UserTypeSwitch handleSwitchUserType={handleSwitchUserType}/>}
              {DEFINED_USER_TYPE === UserType.teacher && <Button className='general-button-item' variant='light' onClick={newPageEvent}>Nowa strona</Button>}
              {DEFINED_USER_TYPE === UserType.teacher && <Button className='general-button-item' variant='light' disabled={lessonDefinition && lessonDefinition.pages && lessonDefinition.pages.length === 1} onClick={deletePageEvent}>Usuń stronę</Button>}
              <Button data-cy="config-button" className='general-button-item' variant='light' onClick={() => setConfigModalOpen(true)}>Konfiguracja</Button>
            </div>
          </div>
        </div>
        <IconContext.Provider value={{ color: '#fff' }}>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              Pages:
            </li>
            {(lessonDefinition && lessonDefinition.pages) ? lessonDefinition.pages.map((_, idx) => {
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
                (lessonDefinition && lessonDefinition.pages) ? lessonDefinition.pages[currPg].sections.map( (content, sectionIdx) => {
                  return (
                    <li key={currPg*10+sectionIdx} className='nav-text-inner'>
                    <HashLink to={url+"/"+currPg+"/#section"+sectionIdx}>
                      <span >{content.title}</span>
                    </HashLink>
                  </li>
                  )
                })
                : null
              }
          </ul>
        </nav>
        </IconContext.Provider>
        <div className={sidebar ? 'page active' : 'page'}>     
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <LessonPage userType={userType} setUserType={setUserType}/> 
          </ErrorBoundary>
        </div>
        {lessonDefinition ? <ConfigModal open={configModalOpen} configFileContent={lessonDefinition.cargoToml} handleCloseModal={() => setConfigModalOpen(false)} handleSaveConfig={handleSaveConfig}/> : null}
        {lessonDefinition ? <LessonSaveModal open={saveLessonModalOpen} handleCloseModal={() => setSaveLessonModalOpen(false)} handleSaveLesson={handleSaveAndExit} handleExitLesson={handleOpen}/> : null}
      </div>
      
  );
}

export default LessonPageContainer;
