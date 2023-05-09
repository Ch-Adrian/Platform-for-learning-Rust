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

    const updateCell = (newCell, idx, page) => {
        console.log(newCell);
        let modifiedPage = {...lessonDefinition};
        modifiedPage.pages[page].cells[idx] = newCell;
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {cells: modifiedPage.pages[page].cells}
                else return {...pageDef}

            })
        });
    }

    return (
        <LessonContext.Provider value={{...value, updateCell}}>
            {props.children}
        </LessonContext.Provider>
    )
}

export default LessonContextProvider;