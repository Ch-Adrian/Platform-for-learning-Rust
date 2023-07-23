import React from "react";
import {useDropzone} from 'react-dropzone';
import "./FilePicker.css";

const FilePicker = (props) => {
    const onDrop = file => {
        const read = new FileReader();
        read.readAsText(file[0]);
        read.onloadend = () => {
            props.openLesson(JSON.parse(read.result), file[0].name)
        }
    }

    const {getRootProps, 
        getInputProps, 
        isDragActive,
        } = useDropzone({
            onDrop: onDrop, 
            multiple: false,
            accept: {
                'application/json': ['.json']
            }})

    
    return (
        <div {...getRootProps({className: "file-picker"})} style={{borderColor: isDragActive ? "rgb(217, 255, 81)" : ""}}>
            <input {...getInputProps()} />
            {
            isDragActive ?
                <p>Otwórz nową lekcję</p> :
                <p>Otwórz nową lekcję</p>
            }
        </div>
    )
  
}

export default FilePicker