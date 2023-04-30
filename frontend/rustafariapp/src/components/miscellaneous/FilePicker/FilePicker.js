import React from "react";
import {useDropzone} from 'react-dropzone';
import "./FilePicker.css";

const FilePicker = (props) => {
    const onDrop = file => {
        const read = new FileReader();
        read.readAsBinaryString(file[0])
        read.onloadend = () => {
            props.openLesson(JSON.parse(read.result), file[0].name)
        }
    }

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