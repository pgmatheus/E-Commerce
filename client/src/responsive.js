import { css } from "styled-components";

export const mobile = (props) => {
	return css`
		@media only screen and (max-width: 625px) {
			${props}
		}
	`;
};

export const tablet = (props) => {
	return css`
		@media only screen and (max-width: 1200px) and (min-width: 625px) {
			${props}
		}
	`;
};
