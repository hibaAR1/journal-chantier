import styled from "styled-components";

const MenuStyles = styled.nav`
    height: calc(100% - 24%);
    min-height: calc(100% - 24%);
    max-height: calc(100% - 24%);

    @media only screen and (min-width: 768px) {
        height: calc(100% - 150px);
        min-height: calc(100% - 150px);
        max-height: calc(100% - 150px);
    }
`;

export default MenuStyles;
