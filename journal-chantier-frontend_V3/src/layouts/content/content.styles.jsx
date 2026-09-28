import styled from "styled-components";

const ContentStyles = styled.section`
    height: calc(100vh - 12%);
    min-height: calc(100vh - 12%);
    max-height: calc(100vh - 12%);

    @media only screen and (min-width: 768px) {
        height: calc(100vh - 75px);
        min-height: calc(100vh - 75px);
        max-height: calc(100vh - 75px);
    }

    .section {
        height: calc(100vh - (12px + 8px + 40px + .375rem +  12vh));
        min-height: calc(100vh - (12px + 8px + 40px + .375rem +  12vh));
        max-height: calc(100vh - (12px + 8px + 40px + .375rem +  12vh));

        @media only screen and (min-width: 768px) {
            height: calc(100vh - (12px + 8px + 40px + .375rem +  75px));
            min-height: calc(100vh - (12px + 8px + 40px + .375rem +  75px));
            max-height: calc(100vh - (12px + 8px + 40px + .375rem +  75px));
        }
    }

    .section > div,
    .section > form {
        min-width: 100%;
    }
`;

export default ContentStyles;
