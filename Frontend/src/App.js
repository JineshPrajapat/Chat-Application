import './App.css';
import SignUp from './Components/Auth/SignUp';
import { useAuth } from './AuthProvider/AuthProvider';
import Chat from './Components/Chat/Chat';

function App() {
  const { isLoggedIn } = useAuth();
  return (
    <div className="App">

      {!isLoggedIn ?
        <>
          <header className="bg-[#282c34] h-[8vh] flex items-center px-5 text-white text-left text-xl ">Chat Application
          </header>
          <SignUp />
        </>
        :
        <Chat />
      }
    </div>
  );
}

export default App;
