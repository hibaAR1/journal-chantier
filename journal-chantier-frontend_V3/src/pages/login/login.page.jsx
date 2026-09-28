import {useEffect} from "react";

import {useAuthContext} from "../../context/auth/auth.context.jsx";

import {useNavigate} from "react-router-dom";

import {HOME_ROUTE} from "../../router/index.jsx";

import LoginComponent from "../../components/login/login.component.jsx";

const LoginPage = () => {
    const {checkIsAuthenticated} = useAuthContext();

    const navigate = useNavigate();

    useEffect( () => {

        const checkAuthentication = async () => {
            const state = await checkIsAuthenticated();

            if(state) {
                navigate(HOME_ROUTE);
            }
        }

        checkAuthentication();
    }, []);

    return <LoginComponent />
};

export default LoginPage;
