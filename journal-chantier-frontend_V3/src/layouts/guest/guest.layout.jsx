import {useEffect} from "react";

import {Outlet, useNavigate} from "react-router-dom";

import {getAccessToken} from "../../utilities/access-token.js";

import {HOME_ROUTE} from "../../router/index.jsx";

const GuestLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if(getAccessToken()) {
            navigate(HOME_ROUTE);
        }
    }, []);

    return (
        <main
            className={`h-screen w-screen flex justify-center items-center bg-no-repeat bg-center`}>
            <Outlet />
        </main>
    )
};

export default GuestLayout;
