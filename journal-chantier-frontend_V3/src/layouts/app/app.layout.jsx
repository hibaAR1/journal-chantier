import {useEffect, useState} from "react";

import {useAuthContext} from "../../context/auth/auth.context.jsx";

import {SidebarProvider} from "../../context/sidebar/sidebar.context.jsx";

import {Outlet, useNavigate} from "react-router-dom";

import {LOGIN_ROUTE} from "../../router/index.jsx";

import AppStyles from "./app.styles.jsx";

import SidebarLayout from "../sidebar/sidebar.layout.jsx";

import NavbarLayout from "../navbar/navbar.layout.jsx";
import {Toaster} from "../../components/ui/toaster.jsx";

const AppLayout = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const { checkIsAuthenticated } = useAuthContext();

    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            const state = await checkIsAuthenticated();

            if (!state) {
                navigate(LOGIN_ROUTE);
            }

            setLoading(false);
        };

        checkAuthentication();
    }, []);

    if (loading) {
        return null;
    }

        return (
            <SidebarProvider>
                <AppStyles className="flex font-dax overflow-hidden">
                    <SidebarLayout />

                    <main className="flex-1 box-border ps-0 md:ps-[25px] md:ml-[250px] overflow-hidden">
                        <NavbarLayout />

                        <div className="content">
                            <Outlet />
                        </div>
                    </main>

                    <Toaster />
                </AppStyles>
            </SidebarProvider>
        );
    };

export default AppLayout;
