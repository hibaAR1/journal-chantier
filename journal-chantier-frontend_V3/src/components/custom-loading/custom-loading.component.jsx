import './custom-loading.styles.css';

const CustomLoadingComponent = (
    { width = 100, height = 100,
        borderColor = '#000',
        fillColor = '#000'
    }) => {
    return (
        <div
            className="custom-loading"
            aria-label="rotating-square-loading"
            aria-busy="true"
            role="progressbar"
            style={{width, height}}
        >
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 100 100"
                height={height}
                width={width}
                xmlSpace="preserve"
            >
                {/* Outer Rectangle */}
                <rect
                    fill="none"
                    stroke={borderColor}
                    x="25"
                    y="30"
                    width="50"
                    height="40"
                >
                    <animateTransform
                        attributeName="transform"
                        dur="0.5s"
                        from="0 50 50"
                        to="180 50 50"
                        type="rotate"
                        id="strokeBox"
                        attributeType="XML"
                        begin="rectBox.end"
                    />
                </rect>

                {/* Inner Filling */}
                <rect
                    x="25"
                    y="30"
                    fill={fillColor}
                    width="50"
                    height="40"
                >
                    <animate
                        attributeName="height"
                        dur="1.3s"
                        attributeType="XML"
                        from="40"
                        to="0"
                        id="rectBox"
                        fill="freeze"
                        begin="0s;strokeBox.end"
                    />
                </rect>
            </svg>
        </div>
    );
};

export default CustomLoadingComponent;