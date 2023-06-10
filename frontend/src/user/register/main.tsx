import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/custom/button";
import Loading from "../../../components/custom/loading";
import { useSignupMutation } from "../../../components/hook/userHooks";
import { ApiError } from "../../../types/ApiError";
import { getError } from "../../../utils/getError";
import { Store } from "../../../utils/store";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../../components/layout";


function Signup() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)?.get('redirect')
  const redirect = params ? params : '/'
  const navigate = useNavigate()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const {isLoading, mutateAsync: signup} = useSignupMutation()

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      toast.warning("Password Dont Match", { autoClose: 1000 });
      return;
    }
    try {
      const data = await signup({name, email, password})
      dispatch({ type: "AUTH", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect);
      toast.success("Successfully Create Account", { autoClose: 1000 });
    } catch (error) {
      toast.error(getError(error as ApiError), { autoClose: 1000 });
    }
  };
  return (
    <Layout title="Register" description="Register Page">
      <div className="container">
        <div className="flex justify-center items-center flex-col mb-10 ">
          <h3 className="text-2xl md:text-4xl font-bold text-cyan-700 mb-2">
            Welcome To Register Pages
          </h3>
          <p className="text-sm md:text-base max-w-sm text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            euismod, lacus ac interdum sagittis{" "}
          </p>
        </div>
        <div className="flex items-center flex-col">
          <form className="w-3/4 md:w-[450px]" onSubmit={submitHandler}>
            <div className="mb-3 flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                className="text-sm md:text-base px-4 py-2 mt-2 focus:outline-none bg-cyan-700 rounded-lg"
                type="name"
                autoFocus
                required
                id="name"
                placeholder="Input Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3 flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                className="text-sm md:text-base px-4 py-2 mt-2 focus:outline-none bg-cyan-700 rounded-lg"
                type="email"
                required
                id="email"
                placeholder="Input Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3 flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                className="text-sm md:text-base px-4 py-2 mt-2 focus:outline-none bg-cyan-700 rounded-lg"
                type="password"
                required
                id="password"
                placeholder="Input Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-7 flex flex-col">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="text-sm md:text-base px-4 py-2 mt-2 focus:outline-none bg-cyan-700 rounded-lg"
                type="password"
                required
                id="confirmPassword"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="relative">
              <Button type="submit" text="Sign Up" condition="on" />
              {isLoading && (
                <div className="absolute top-2 left-10">
                  <Loading.Spin />
                </div>
              )}
            </div>
            <div className="mt-5 text-sm md:text-base">
              <span>
                Already Have An Account{" "}
                <Link to="/user/signin" className="text-yellow-400">
                  Signin
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Signup;
