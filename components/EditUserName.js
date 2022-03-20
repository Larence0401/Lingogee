import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db, useAuth } from "../firebase";

const EditUserName = () => {
  const [inputIsOpen, setInputIsOpen] = useState(false);
  const [username, setUsername] = useState("true");
  const [dbUsername, setDbUsername] = useState(null);
  const user = useAuth();

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user?.uid), (doc) => {
      setDbUsername(doc.data()?.username);
    });
  }, [user]);

  const saveUsername = async (e) => {
    e.preventDefault();
    if (username.length >= 2) {
      await updateDoc(doc(db, "users", user?.uid), { username });
      setInputIsOpen(false);
    }
  };

  return (
    <div className="w-full h-28 bg-gray-100 p-4 px-8 flex items-center justify-center">
      {inputIsOpen ? (
        <>
          <input
            type="text"
            className="py-2 px-4 rounded mr-3 italic"
            placeholder="type username ..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <IconButton onClick={saveUsername}>
            <CheckIcon color="success" />
          </IconButton>
          <IconButton onClick={() => setInputIsOpen(false)}>
            <CancelIcon sx={{ color: red[500] }} />
          </IconButton>
        </>
      ) : (
        <>
          <span className="italic text-gray-800">
            {dbUsername ? dbUsername : "Choose a username ..."}
          </span>{" "}
          <span className="opacity-60">
            <IconButton onClick={() => setInputIsOpen(true)}>
              <EditIcon />
            </IconButton>
          </span>
        </>
      )}
    </div>
  );
};

export default EditUserName;
