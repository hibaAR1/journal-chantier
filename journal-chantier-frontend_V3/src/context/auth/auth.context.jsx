import {createContext, useContext, useState} from "react";

import AuthApis from "../../apis/auth.apis.jsx";

import {HOME_ROUTE, LOGIN_ROUTE} from "../../router/index.jsx";
import {getAccessToken, removeAccessToken, setAccessToken} from "../../utilities/access-token.js";
import {error} from "../../utilities/errors.js";

const AuthContext = createContext({
    user: {},
    authenticated: false,
    checkIsAuthenticated: () => {},
    login: () => {},
    logout: () => {},
    changePassword: () => {}
});

export const UserProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [authenticated, setAuthenticated] = useState(getAccessToken());

    const checkIsAuthenticated = async () => {
        if (getAccessToken()) {
            await AuthApis.getUser().then(response => {
                setUser({...response.data});

                error();
            }).catch(() => {
                removeAccessToken();
                return checkIsAuthenticated();
            });

            return true;
        } else {
            setAuthenticated(false);

            setUser(null);

            return false;
        }
    };

    const login = async (values, form, navigate) => {
        const {setError} = form;

        return await AuthApis.login(values)
            .then(response => {
                if (response.status === 200) {
                    setAccessToken(response.data.token);
                    setUser(response.data.user);
                    navigate(HOME_ROUTE);
                }
            })
            .catch(({response}) => {
                setError("login", {
                    message: response.data.errors.login.join()
                })
            });
    };

    const logout = async (navigate) => {
        await AuthApis.logout()
            .then(response => {
                if (response.status === 200) {
                    setUser({});
                    setAuthenticated(false);
                    removeAccessToken();
                    navigate(LOGIN_ROUTE);
                }
            })
    };

    const changePassword = async (values, form) => {
        const {setError} = form;

        return await AuthApis.changePassword(values)
            .then(response => {
                if (response.status === 200) {
                    return true;
                }
            })
            .catch(({response}) => {
                if (response.status === 401) {
                    setError("current_password", {
                        message: 'Le mot de passe actuel est incorrect'
                    });
                } else {
                    setError("current_password", {
                        message: response.data.errors.current_password.join()
                    });

                    setError("new_password", {
                        message: response.data.errors.new_password.join()
                    });

                    setError("new_password_confirmation", {
                        message: response.data.errors.confirm_password.join()
                    });
                }
            });
    };

    return (
        <AuthContext.Provider value={{
            user,
            authenticated,
            checkIsAuthenticated,
            login,
            logout,
            changePassword
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuthContext = () => useContext(AuthContext);
