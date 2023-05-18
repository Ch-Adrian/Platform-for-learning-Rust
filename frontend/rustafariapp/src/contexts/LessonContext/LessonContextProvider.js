import React, { createContext, useMemo, useState, useEffect } from "react";

export const LessonContext = createContext({});

const LessonContextProvider = (props) => {
    const [lessonDefinition, setLessonDefinition] = useState();

    // Those two functions below are for persisiting the lesson state on page refresh
    useEffect(() => {
        if (window.localStorage.getItem('lessonDefinition') !== 'undefined') setLessonDefinition(JSON.parse(window.localStorage.getItem('lessonDefinition')));
    }, []);

    useEffect(() => {
        window.localStorage.setItem('lessonDefinition', JSON.stringify(lessonDefinition));
    }, [lessonDefinition]);

    const value = useMemo(() => {
        return {
            lessonDefinition, 
            setLessonDefinition
          }
    }, [lessonDefinition]);

    const updateCell = (newCell, idx, page, section) => {
        let modifiedLesson = {...lessonDefinition};
        modifiedLesson.pages[page].sections[section].cells[idx] = newCell;
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {sections: modifiedLesson.pages[page].section[section]}
                else return {...pageDef}

            })
        });
    }

    const addCell = (newCell, idx, page, section) => {
        let modifiedLesson = {...lessonDefinition};
        modifiedLesson.pages[page].sections[section].cells.splice(idx+1, 0, newCell);    
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {sections: modifiedLesson.pages[page].section[section]}
                else return {...pageDef}

            })
        });
    }

    return (
        <LessonContext.Provider value={{...value, updateCell, addCell}}>
            {props.children}
        </LessonContext.Provider>
    )
}

export default LessonContextProvider;