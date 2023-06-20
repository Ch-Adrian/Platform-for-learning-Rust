import React, { createContext, useMemo, useState, useEffect, useCallback } from "react";

export const LessonContext = createContext({});

const LessonContextProvider = (props) => {
    const [lessonDefinition, setLessonDefinition] = useState();
    const [lessonName, setLessonName] = useState();

    // Those two functions below are for persisiting the lesson state on page refresh
    useEffect(() => {
        if (window.localStorage.getItem('lessonDefinition') !== 'undefined') setLessonDefinition(JSON.parse(window.localStorage.getItem('lessonDefinition')));
        if (window.localStorage.getItem('lessonName') !== 'undefined') setLessonName(window.localStorage.getItem('lessonName'));
    }, []);

    useEffect(() => {
        window.localStorage.setItem('lessonDefinition', JSON.stringify(lessonDefinition));
    }, [lessonDefinition]);

    useEffect(() => {
        window.localStorage.setItem('lessonName', lessonName);
    }, [lessonName])

    const value = useMemo(() => {
        return {
            lessonDefinition, 
            setLessonDefinition,
            lessonName,
            setLessonName
          }
    }, [lessonDefinition, lessonName]);

    const updateCell = useCallback((newCell, idx, page, section) => {
        let modifiedLesson = window.structuredClone(lessonDefinition);
        modifiedLesson.pages[page].sections[section].cells[idx] = newCell;
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {sections: modifiedLesson.pages[page].sections[section]}
                else return {...pageDef}
            })
        });
    }, [lessonDefinition])

    const addCell = (newCell, idx, page, section) => {
        page = parseInt(page);
        section = parseInt(section);
        idx = parseInt(idx);
        let modifiedLesson = window.structuredClone(lessonDefinition);
        modifiedLesson.pages[page].sections[section].cells.splice(idx+1, 0, newCell);    
        setLessonDefinition(modifiedLesson);
    }

    const removeCell = (idx, page, section) => {
        page = parseInt(page);
        section = parseInt(section);
        let modifiedLesson = window.structuredClone(lessonDefinition);
        modifiedLesson.pages[page].sections[section].cells.splice(idx, 1);
        setLessonDefinition(modifiedLesson);
    }

    const addSection = (newSection, page, section) => {
        page = parseInt(page);
        section = parseInt(section);
        let modifiedLesson = window.structuredClone(lessonDefinition);
        modifiedLesson.pages[page].sections.splice(section+1, 0, newSection);    
        setLessonDefinition(modifiedLesson);
    }

    const changeTitle = (newTitle, page, sectionIdx) => {
        page = parseInt(page);
        sectionIdx = parseInt(sectionIdx);
        let modifiedLesson = window.structuredClone(lessonDefinition);
        let newSections = modifiedLesson.pages[page].sections.map((content,idx) => {
                if(idx === sectionIdx){
                     return {...content, title: newTitle} 
                } else return content;
            });

        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === Number.parseInt(page)) {
                    return {sections: newSections}
                }
                else {
                    return {...pageDef}
                }
            })
        });
    }

    const getTitle = (page, sectionIdx) => {
        return lessonDefinition.pages[page].sections[sectionIdx].title;
    }


    const removeSection = (page, section) => {
        let modifiedLesson = window.structuredClone(lessonDefinition);;
        page = parseInt(page);
        section = parseInt(section);
        modifiedLesson.pages[page].sections.splice(section, 1);
        setLessonDefinition(modifiedLesson);
    }

    return (
        <LessonContext.Provider value={{...value, updateCell, addCell, addSection, removeCell, removeSection, changeTitle, getTitle}}>
            {props.children}
        </LessonContext.Provider>
    )
}

export default LessonContextProvider;
