import React from "react";

const Button = ({processing, content})=>{
    return(
        <button type="submit" className={`mt-6 py-2 w-full bg-blue-600 rounded-md text-white ${processing ? "bg-blue-400": ""} `} disabled={processing}>
            <span>{processing ? "processing..." : content}</span>
        </button>
    )
}

export default Button;