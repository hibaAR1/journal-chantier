import {Link} from "react-router-dom";
import {Button} from "../ui/button.jsx";
import {useState} from "react";

const LinkIconBtnComponent = ({link, text_color, bg_color, children}) => {
    const [isBtnHovered, setIsBtnHovered] = useState(false);

    const defaultBtnStyle = {
        backgroundColor: text_color,
        color: bg_color,
        borderRadius: '5px',
        border: `1px solid ${bg_color}`
    };

    const hoverBtnStyle = {
        backgroundColor: bg_color,
        color: text_color,
        borderRadius: '5px',
        border: `1px solid ${text_color}`
    };

    const btnStyle = isBtnHovered ? hoverBtnStyle : defaultBtnStyle;

    return (
        <Link to={link} >
            <Button
                className="rounded p-2 h-6 px-1"
                size={1}
                style={{...btnStyle}}
                onMouseEnter={() => setIsBtnHovered(true)}
                onMouseLeave={() => setIsBtnHovered(false)}
            >
                {children}
            </Button>
        </Link>
    )
};

export default LinkIconBtnComponent;