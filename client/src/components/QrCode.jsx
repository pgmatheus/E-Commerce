import QRCode from "react-qr-code";
import { Container } from "../styledComponents/css";
import styled from "styled-components/macro";

const QrCode = (props) => {
	return (
		/* 		<div>
			{props?.pixValue && (
				<Container>
					<div
						style={{
							height: "auto",
							margin: "0 auto",
							maxWidth: props.size || 192,
							width: "100%",
						}}
					>
						<QRCode
							size={192}
							style={{ height: "auto", maxWidth: "100%", width: "100%" }}
							value={props.pixValue}
							viewBox={`0 0 ${props.size} ${props.size}` || `0 0 192 192`}
						/>
					</div>
				</Container>
			)}
		</div> */

		<div
			id={"QrCode"}
			style={{
				/* height: "auto",
				margin: "0 auto", */
				maxWidth: 200,
				width: "100%",
				padding: "20px",
				backgroundColor: "white",
			}}
		>
			<QRCode
				size={160}
				style={{ height: "auto", maxWidth: "100%", width: "100%" }}
				value={props.pixValue}
				viewBox={`0 0 160 160`}
			/>
		</div>
	);
};

export default QrCode;
