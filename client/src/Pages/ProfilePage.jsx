import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {

  const {authuser, updateProfile} = useContext(AuthContext)

  const [selectedImage, SetselectedImage] = useState(null)
  const navigate = useNavigate()
  const [name, SetName] = useState(authuser.fullname)
  const [bio, Setbio] = useState(authuser.bio)

 const handlesubmit = async (e) => {
  e.preventDefault();

  const payload = {
    fullname: name,
    bio: bio,
  };

  if (selectedImage) {
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Image = reader.result;
      payload.profilePic = base64Image;

      await updateProfile(payload);
      navigate('/');
    };

    reader.readAsDataURL(selectedImage);
  } else {
    await updateProfile(payload);
    navigate('/');
  }
};


  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-900 border-2 border-gray-700 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handlesubmit} className="flex flex-col gap-5 p-10 flex-1" action="">
          <h3 className="text-lg ">Profile details</h3>
        <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
          <input onChange={(e)=>SetselectedImage(e.target.files[0])} type="file" name="" id="avatar" accept=".png, .jpg .jpeg" hidden />
        <img src={selectedImage ? URL.createObjectURL(selectedImage) : (authuser?.profilePic || assets.avatar_icon)} alt="" className={`w-12 h-12 ${selectedImage || authuser && 'rounded-full'}`} />
        Upload profile image
        </label>
        
          <input type="text" onChange={(e)=>SetName(e.target.value)} value={name} placeholder="Add your name.." className="p-2 border-gray-900 rounded-md focus:outline-none focus-ring-2 focus:ring-violet-600" />
        <textarea  onChange={(e)=>Setbio(e.target.value)} value={bio} className="p-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus-ring-violet-500 " rows={4} placeholder="write profile bio" id="">

        </textarea>
        <button type="submit" className="bg-gradient-to-r from-purple-500 to-violet-500 text-white p-2 rounded-full text-lg cursor-pointer">Save</button>
        
        </form>
        <img alt="" className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage && "rounded-full"}`} src={authuser?.profilePic ||assets.logo}/>
      </div>
    </div>
  );
};

export default ProfilePage;
