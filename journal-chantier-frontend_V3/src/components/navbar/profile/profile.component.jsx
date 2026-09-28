import {useAuthContext} from "../../../context/auth/auth.context.jsx";

import {useNavigate} from "react-router-dom";

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "../../ui/dropdown-menu.jsx";

import {Avatar, AvatarImage, AvatarFallback} from "../../ui/avatar.jsx";

import {FiLogOut} from "react-icons/fi";
import ChangePasswordLayout from "../../../layouts/auth/change-password/change-password.layout.jsx";
// import {useState} from "react";

// import black from '../../../assets/svg/black.svg'

const ProfileComponent = () => {
    const {user, logout} = useAuthContext();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout(navigate);
    }

    return (
        <div className="flex justify-center items-center ms-auto">
            <div className="flex flex-col justify-start items-end me-3">
                <span className="font-medium text-md sm:text-sm">{user.name}</span>
                <span className="font-light text-md sm:text-sm mt-[-.5rem] sm:mt-[-.25rem]">
                    {user.job}
                </span>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger className="relative">
                    <Avatar className="scale-105 sm:scale-105">
                        {/*<AvatarImage src={black}/>*/}
                        <AvatarFallback className="bg-primary-600 text-white border-primary-600">
                            {user.profile}
                        </AvatarFallback>
                    </Avatar>

                    <span
                        className="w-[35%] h-[35%] bg-green-600 rounded-[50%] absolute bottom-[-5%] right-[-5%] translate-[50%]"
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <ChangePasswordLayout/>

                    <DropdownMenuItem>
                        <div
                            onClick={handleLogout}
                            className="flex justify-center items-center gap-1/2 cursor-pointer"
                        >
                            <FiLogOut className="me-2" />
                            Se déconnecter
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
};

export default ProfileComponent;
