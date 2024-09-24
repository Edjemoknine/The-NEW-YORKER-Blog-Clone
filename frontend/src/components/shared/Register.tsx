import { SignupForm } from "@/lib/AuthForm";
import { cn } from "@/lib/utils";

const Register = ({ isLogin, setLogin }: { isLogin: boolean; setLogin: (isLogin: boolean) => void }) => {
  return (
    <div
      className={cn(
        "w-screen flex justify-center items-center",
        isLogin
          ? "-translate-x-1/3 opacity-0 transition duration-1000"
          : "translate-x-0 opacity-1 transition duration-1000"
      )}
    >
      {" "}
      <SignupForm setLogin={setLogin} isLogin={isLogin} />
    </div>
  );
};

export default Register;
