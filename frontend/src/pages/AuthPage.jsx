import React from "react";
import LoginForm from "../components/LoginForm";

export default function AuthPage() {
  // const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full  bg-white shadow-lg rounded">
        <LoginForm />

        {/* {isLogin ? <LoginForm /> : <SignupForm />} */}

        {/*  below button should be in form not here.  */}
        {/* <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-blue-500"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have one? Log in"}
        </button>{" "}
        // not getting this logic  */}
      </div>
    </div>
  );
}
