import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useToast from "../Hooks/useToast";
import { useLoader } from "../contexts/LoaderContext";
import { submitLogin } from "../Utils/user.fonction";

import Button from "../Components/Button";
import Input from "../Components/Input";
import AuthLayout from "../Components/AuthLayout";

import "../styles/signin.scss";
import "../styles/button.scss";

const Signin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { onError, onSuccess } = useToast();
  const { showLoader, hideLoader } = useLoader(); // Utilisation du hook Loader

  const handleLogin = async (e: any): Promise<void> => {
    

    showLoader();
    e.preventDefault();
    try {
      const response: any = await submitLogin(e, password, email.toLowerCase());
      
      if (response.status === 401) {
        onError(response.response.data.message);
      }
      if (response !== undefined) {
       
        localStorage.setItem("isConnected", "true");
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("username", response.data.user.username);
        onSuccess("Connexion réussie");
        navigate(`/dashboard/${localStorage.getItem("userId")}`);
        hideLoader();
        return;
      }
      
    } catch (error) {
      console.log(error);
      
     
    }
  };
  //@ts-ignore
  return (
    <AuthLayout title="Connexion">
      <form onSubmit={(e: any) => handleLogin(e)}>
        <Input
          type="text"
          name="email"
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          classname="signin__email"
        />
        <Input
          type="password"
          name="password"
          label="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          classname="signin__password"
        />
        <p className="signup__text">
          Vous n'avez pas de compte ?{" "}
          <Link to="/signup" className="signup__link">
            Inscrivez-vous
          </Link>
        </p>
        <Button className="btn" type="submit">
          Se connecter
        </Button>
      </form>
    </AuthLayout>
  );
};
export default Signin;
