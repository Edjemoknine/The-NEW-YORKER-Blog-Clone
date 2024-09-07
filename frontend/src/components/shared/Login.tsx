// import { SignupForm } from "@/lib/AuthForm";
import { SignupForm } from "@/lib/AuthForm";
import { cn } from "@/lib/utils";

const Login = ({ isLogin }) => {
  return (
    <div
      className={cn(
        "w-screen h-full  flex justify-center items-center ",
        !isLogin
          ? "translate-x-1/3 opacity-0 transition duration-1000"
          : "-translate-x-0 opacity-1 transition duration-1000"
      )}
    >
      <SignupForm isLogin={isLogin} />
    </div>
  );
};

export default Login;
