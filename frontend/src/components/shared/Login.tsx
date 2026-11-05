import { SignupForm } from "@/components/forms/AuthForm";
import { cn } from "@/lib/utils";

const Login = ({
  isLogin,
  setIsLogin,
}: {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}) => {
  return (
    <div
      className={cn(
        "w-screen h-full flex justify-center items-center",
        !isLogin
          ? "pointer-events-none translate-x-1/3 opacity-0 transition duration-1000"
          : "relative z-10 -translate-x-0 opacity-100 transition duration-1000",
      )}
    >
      <SignupForm isLogin={isLogin} setLogin={setIsLogin} />
    </div>
  );
};

export default Login;
