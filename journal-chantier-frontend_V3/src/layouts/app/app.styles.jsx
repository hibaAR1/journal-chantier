import styled from "styled-components";

const AppStyles = styled.div`
    
    & > main {
        height: 100vh;
        min-height: 100vh;
        max-height: 100vh;
        width: 100vw;
        min-width: 100vw;
        max-width: 100vw;

        @media only screen and (min-width: 768px) {
            width: calc(100vw - 250px);
            min-width: calc(100vw - 250px);
            max-width: calc(100vw - 250px);
        }
    }

    & .content {
        height: calc(100vh - 12vh);
        min-height: calc(100vh - 12vh);
        max-height: calc(100vh - 12vh);

        @media only screen and (min-width: 768px) {
            height: calc(100vh - 75px);
            min-height: calc(100vh - 75px);
            max-height: calc(100vh - 75px);
        }
    }
`;

export default AppStyles;
