import {CircleLoader} from "react-spinners";
import CustomLoadingComponent from "../custom-loading/custom-loading.component.jsx";

const LoadingComponent = () => {
    return (
        <div className="w-[100%] h-[100%] flex flex-col justify-center items-center">
            <CircleLoader className='scale-[3.7]' color="#d76a3e"/>
        </div>
    )
};

export default LoadingComponent;
