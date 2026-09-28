import motif from "../../assets/motif-tcgm.png";

const ErrorPage = () => {
    return (
        <div
            style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('${motif}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
            className="w-screen h-screen flex justify-center items-center"
        >
            <div className="space-y-8 p-10 sm:px-24 sm:py-10 border-4 border-primary-950 rounded-2xl scale-120 bg-white">
                404 page introuvable
            </div>
        </div>
    );
};

export default ErrorPage;