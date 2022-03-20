import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Button } from "@mui/material";
import { useTranslationContext } from "../store/context";
import { db, storage, useAuth, signOutUser } from "../firebase";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import EditUserName from "./EditUserName";

const EditProfile = ({ setIsOpen }) => {
  const [opacity, setOpacity] = useState("opacity-100");
  const { state, dispatch } = useTranslationContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [pic, setPic] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const user = useAuth();

  if (user) {
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      setPic(doc.data()?.profilePic);
      setPhotoURL(doc.data()?.photoURL);
    });
  }

  useEffect(() => dispatch({ type: "setProfilePicture", payload: pic }), [pic]);

  const prevPic = pic ? pic : photoURL ? photoURL : "/avatar.svg";
  const profilePic = selectedFile ? selectedFile : prevPic;

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const storeNewProfilePic = async (e) => {
    e.preventDefault();

    if (!selectedFile || !user) return;
    const imageRef = ref(storage, `users/${user.uid}`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "users", user.uid), {
          profilePic: downloadURL,
        });
      }
    );
    setSelectedFile(null);
    setIsUpdated(true);
  };

  return (
    <div className="flex flex-col">
      <div className="bg-sky-600 h-28 w-full p-4 flex items-center">
        <span
          className="text-sky-50 hover:text-white p-4 pl-0 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <ArrowBackIcon fontSize="medium" />
        </span>
        <span className="text-white text-xl">Profile</span>
      </div>
      <div className="flex justify-center p-8 pb-4">
        <input
          type="file"
          id="fileUpload"
          name="fileUpload"
          hidden
          onChange={addImageToPost}
        />
        <label htmlFor="fileUpload">
          <div
            className={`relative w-[175px] h-[175px] rounded-full overflow-hidden bg-slate-50 cursor-pointer mb-4`}
            onMouseEnter={() => setOpacity("opacity-50")}
            onMouseLeave={() => setOpacity("opacity-100")}
            onClick={() => dispatch({ type: "showModal", payload: true })}
          >
            <img
              src={profilePic}
              alt=""
              className={`object-fill ${opacity} transition-opacity duration-200 ease-in-out`}
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 bg-opacity-0 bg-black transition-opacity duration-200 ease-in-out hover:opacity-100 hover:bg-opacity-30">
              <span className="text-white pb-2">
                <CameraAltIcon />
              </span>
              <span className="uppercase w-[50%] text-center">
                Edit Profile
              </span>
            </div>
          </div>
        </label>
      </div>
      {selectedFile && (
        <button
          className="bg-sky-600 hover:bg-sky-700 text-white rounded mx-16 py-2 shadow-lg uppercase text-sm"
          onClick={storeNewProfilePic}
        >
          Update Profile Pic
        </button>
      )}
      {isUpdated && (
        <span className="italic text-sky-600 mx-auto">
          Picture updated successfully!
        </span>
      )}
      <EditUserName />
      <Button className="mt-2" onClick={signOutUser}>
        Logout
      </Button>
    </div>
  );
  return <div>Edit Profile</div>;
};

export default EditProfile;
