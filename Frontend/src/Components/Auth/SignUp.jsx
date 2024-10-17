import React, { useState } from "react";
import axios from "axios";
import {baseURL} from "../../API/api";
import { useAuth } from "../../AuthProvider/AuthProvider";
import InputField from "./InputField";
import Button from "./Button";

function SignUp() {
    const { setIsLoggedIn } = useAuth();
    const [processing, setProcessing] = useState(false);
    const [isLoginForm, setIsLoginForm] = useState(false);
    const [formValue, setFormValue] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    });

    const [loginFormValue, setLoginFormValue] =useState({
        email:"",
        password:""
    });

    const loginHandleFormChange = (event)=>{
        const {name, value} = event.target;
        setLoginFormValue({ ...loginFormValue, [name]: value });
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'username') {
            const username = value.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
            setFormValue({ ...formValue, [name]: username });
        }
        else {
            setFormValue({ ...formValue, [name]: value });
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        let url=null;
        let formData=null;
        if(isLoginForm){
            url = baseURL+"/user/logIn";
            formData = loginFormValue;
        }
        else{
            url = baseURL+"/user/signUp";
            formData = formValue;
        }
        console.log(url)
        axios.post(url, formData)
            .then(response => {
                if (response.status === 200) {
                    console.log(response);
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("userId", response.data.payload.userId);
                    localStorage.setItem("email", response.data.payload.email);
                    localStorage.setItem('userName', response.data.payload.username);
                    localStorage.setItem('fullName', response.data.payload.fullName);
                    localStorage.setItem('profileImage', response.data.payload.profileImage);

                    setIsLoggedIn(true);
                }
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 409) {
                        console.log("User Already exist");
                        setIsLoginForm(true);
                    }
                    else if (error.response.status === 403) {
                        console.log("All fields are required");
                    }
                    else if (error.response.status === 401) {
                        console.log("User not exist, Please signUp");
                        setIsLoginForm(false);
                    }
                    else if (error.response.status === 402) {
                        console.log("Password do not match");
                    }
                    else {
                        console.log('Error;', error);
                    }
                }
            })
            .finally(() => {
                setProcessing(false);
                setFormValue({
                    fullName: "",
                    username: "",
                    email: "",
                    password: ""
                });
            });
    }

    return (
        <div className="h-[92vh] bg-white flex flex-col justify-center items-center">

            <div className="flex justify-around mb-10 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                <span className={`py-3 px-5 md:px-10  rounded-full cursor-pointer duration-500  ${!isLoginForm ? "bg-[#282c34] text-white" : "bg-[#e1dfdf] text-black"}`} onClick={() => setIsLoginForm(false)}>SignUp</span>
                <span className={`py-3 px-5 md:px-10  rounded-full cursor-pointer duration-500 ${isLoginForm ? "bg-[#282c34] text-white" : "bg-[#e1dfdf] text-black"}`} onClick={() => setIsLoginForm(true)}>LogIn</span>

            </div>

            {!isLoginForm ? (
                <form className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 text-left" onSubmit={handleFormSubmit}>
                    <InputField
                        label="Full Name"
                        placeholder="Full Name"
                        name="fullName"
                        type="text"
                        value={formValue.fullName}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Username"
                        placeholder="Username - whitespace not allowed"
                        name="username"
                        type="text"
                        value={formValue.username}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Email"
                        placeholder="name@gmail.com"
                        name="email"
                        type="text"
                        value={formValue.email}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Password"
                        placeholder="Password"
                        name="password"
                        type="password"
                        value={formValue.password}
                        onChange={handleChange}
                        required
                    />

                    <Button processing={processing} content="SignUp" />
                </form>
            ) : (
                <form className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 text-left" onSubmit={handleFormSubmit}>
                    <InputField
                        label="Email"
                        placeholder="name@gmail.com"
                        name="email"
                        type="text"
                        value={loginFormValue.email}
                        onChange={loginHandleFormChange}
                        required
                    />
                    <InputField
                        label="Password"
                        placeholder="Password"
                        name="password"
                        type="password"
                        value={loginFormValue.password}
                        onChange={loginHandleFormChange}
                        required
                    />

                    <Button processing={processing} content="LogIn" />
                </form>
            )}
        </div>
    )
}

export default SignUp;