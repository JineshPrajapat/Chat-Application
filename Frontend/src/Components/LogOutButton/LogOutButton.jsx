import React from 'react';

function LogOutButton() {

  const handleLogout = () => {
    localStorage.clear(); 
    window.location.href = '/'; 
  };

  return (
    <button onClick={handleLogout} className='duration-500 hover:bg-gray-900 px-2 cursor-pointer rounded'>Logout</button>
  );
}

export default LogOutButton;
