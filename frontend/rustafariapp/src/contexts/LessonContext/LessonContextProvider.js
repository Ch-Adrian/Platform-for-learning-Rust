import React, { createContext, useMemo, useState } from "react";

export const LessonContext = createContext({});

const LessonContextProvider = (props) => {
    const [lessonDefinition, setLessonDefinition] = useState({});

    const value = useMemo(() => {
        return {
            lessonDefinition, 
            setLessonDefinition
          }
    }, [lessonDefinition]);

    const updateCell = (newCell, idx, page) => {
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