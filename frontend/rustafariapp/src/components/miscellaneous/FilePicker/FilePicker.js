import React, { useState, useCallback, useMemo } from "react";
import {useDropzone} from 'react-dropzone';
import Dropzone from 'react-dropzone';
import "./FilePicker.css";

const FilePicker = (props) => {
    const onDrop = useCallback(file => {
        const read = new FileReader();
        read.readAsBinaryString(file[0])
        read.onloadend = () => {
            props.openLesson(JSON.parse(read.result))
        }
    }, [])

    const {getRootProps, 
        getInputProps, 
        isDragActive,
        } = useDropzone({onDrop: onDrop, multiple: false})

    
    return (
        <div {...getRootProps({className: "file-picker"})} style={{borderColor: isDragActive ? "rgb(217, 255, 81)" : ""}}>
            <input {...getInputProps()} />
            {
            isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Select or drop a lesson</p>
            }
        </div>
    )
  
}

export default FilePicker