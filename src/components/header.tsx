import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import nuberLogo from "../images/logo.svg";

export const Header:React.FC = () => {
    const { data } = useMe();
    return (
        <header className=" py-4">
            <div className="w-full max-w-screen-xl mx-auto px-5 xl:px-0 flex justify-between items-center">
                <img src={nuberLogo} className="w-24" alt="Nuber Eats" />
                <Link to="/my-profile">
                    <span className="text-xs"><FontAwesomeIcon icon={faUser} className="text-xl"/></span>
                </Link>
            </div>
        </header>
    );
}
