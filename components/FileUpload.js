import { useEffect, useState } from "react";
import Image from "next/image";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const FileUpload = ({ file, sendMessage, setInput, setSelectedFile }) => {
  return (
    <div className="">
      <div className="flex flex-col pl-4 bg-sky-50">
        <IconButton
          className="self-start"
          onClick={() => setSelectedFile(null)}
        >
          <CloseIcon className="text-3xl" />
        </IconButton>

        <img
          src={file}
          className="shadow-xl mb-8 max-h-[50vh] h-fit w-fit mt-4"
        />
        <div>
          <input
            type="text"
            className="w-[600px] rounded leading-10 border-2 border-sky-100 px-8 py-2 mr-4"
            placeholder="Type your message here ..."
            onChange={(e) => setInput(e.target.value)}
          />
          <SendIcon
            className="text-sky-600 hover:text-sky-700 text-4xl"
            onClick={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
