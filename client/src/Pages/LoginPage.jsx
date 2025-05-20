import React, { use, useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {


  const [currentState, SetcurrentState] = useState("Sign Up")
  const [fullname, SetfullName] = useState("")
  const [email, Setemail] = useState("")
  const [password, Setpassword] = useState('')
  const [bio, Setbio] = useState('')
  const [isDataSubmitted, SetisDatasubmitted] = useState(false)

  const {login} = useContext(AuthContext)

const onSubmitHandler = (e) => {
  e.preventDefault();

  if (currentState === "Sign Up" && !isDataSubmitted) {
    SetisDatasubmitted(true); // ✅ Use proper camelCase
    return;
  }

  const route = currentState === "Sign Up" ? "signup" : "login"; // ✅ lowercase route if used in API

  login(route, { fullname, email, password, bio });
};

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-smLflex-col backdrop-blur-2xl'>

      {/* left */}

<img src={assets.logo_big1} alt="" className='w-[min(30vw,250px)]' />

{/* right */}

<form onSubmit={onSubmitHandler} className='border-2 h-[450px] w-[370px] bg-white/8 text-black border-gray-600 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
<h2 className='font-medium text-2xl flex justify-between items-center'>
  {currentState}
  {isDataSubmitted &&  <img onClick={()=>SetisDatasubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/> }
 
</h2>

{currentState === "Sign Up" && !isDataSubmitted && (
<input onChange={(e)=>SetfullName(e.target.value)} value={fullname}  type="text" className="p-2 border border-gray-500 rounded-md focus:outline-none" required name="" placeholder='fullname..' id="" />

)}

{!isDataSubmitted && (
  <>
  <input onChange={(e)=>Setemail(e.target.value)} value={email} type="email" placeholder='email' required id="" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
  <input onChange={(e)=>Setpassword(e.target.value)} value={password} type="password" placeholder='Password' required id="" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
  
  </>
)}

{
  currentState === "Sign Up" && isDataSubmitted && (
    <textarea onChange={(e)=>Setbio(e.target.value)} value={bio} rows={4} placeholder='Add Bio..' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required></textarea>
  )
}

<button className='py-3 bg-gradient-to-r from-orange-900 to-red-900 text-white rounded-md cursor-pointer'>
  {currentState === "Sign Up" ? "Create Account" : "Login Now" }
</button>

<div className='flex items-center gap-2 text-sm text-gray-900'>
  <input type="checkbox"  />
  <p>Agree to the terms of use & Privacy policy</p>
</div>

<div className='flex flex-col gap-2'>
  {
    currentState === "Sign Up" ? (
    <p className='text-sm text-gray-600'> Already have an account <span className="font-medium text-red-900 cursor-pointer" onClick={()=>{SetcurrentState("Login"); SetisDatasubmitted(false)}}>Login here</span></p>
    ) : (
     <p className='text-sm text-gray-600'>Create an Account <span onClick={()=>SetcurrentState("Sign Up")}className='font-medium text-violet-500 cursor-pointer'>Click Here</span></p>
    )
  }

</div>
</form>
    </div>
  )
}

export default LoginPage