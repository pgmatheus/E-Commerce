import QrCode from "../components/QrCode";
import styled from "styled-components/macro";
import { useState } from "react";
import * as htmlToImage from "html-to-image";
import { Spinner } from "../styledComponents/css";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const HeaderText = styled.h1`
	text-align: center;
	margin: 10px;
`;

const Button = styled.button`
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 130px;
	border: none;
	display: flex;
	padding: 15px 20px;
	background-color: rgba(79, 70, 229);
	color: white;
	border-radius: 4px;
	cursor: pointer;
	margin: 20px 0px 10px 0px;
`;

const TextInfoContainer = styled.div`
	margin: 10px;
	word-wrap: break-word;
`;

const TextInfo = styled.p``;

const QrCodeFull = (props) => {
	const [showCopy, setShowCopy] = useState(false);
	const [spinner1, setSpinner1] = useState(false);

	const handleClipboard = () => {
		navigator.clipboard.writeText(props.pixValue);
		setShowCopy(() => !showCopy);
	};

	const imageOptions = {
		scale: 2,
		encoderOptions: 1,
		backgroundColor: `white`,
		selectorRemap: { padding: "20px" },
		/* width: "240px",
		heigth: "240px", */
	};

	const downloadImage = async () => {
		if (!spinner1) {
			setSpinner1(true);
			const dataUrl = await htmlToImage.toPng(
				document.querySelector("#QrCode")
			);
			// download image
			const link = document.createElement("a");
			link.download = "QrCode.png";
			link.href = dataUrl;
			link.click();
			setSpinner1(false);
		}
	};

	return (
		<Container style={{ display: "flex" }}>
			<HeaderText>QR CODE</HeaderText>
			<QrCode pixValue={props.pixValue || ""}></QrCode>
			{spinner1 ? (
				<Button>
					<Spinner custom={{ size: "6px" }} />
				</Button>
			) : (
				<Button onClick={() => downloadImage()}>Baixar QrCode</Button>
			)}
			<TextInfoContainer>
				<TextInfo>
					<b>Nome Fantasia</b>: Taliska Fashion
				</TextInfo>
				<TextInfo>
					<b>Nome Pix</b>: Talita Elienice Silva Matos
				</TextInfo>
				<TextInfo>
					<b>Valor</b>: R$ {props?.info?.sum || ""}
				</TextInfo>
				<TextInfo>
					<b>Chave</b>: {props?.info?._id || props?.info?.code || ""}
				</TextInfo>
			</TextInfoContainer>
			<TextInfoContainer style={{ width: "80%" }}>
				<TextInfo
					onClick={() => handleClipboard()}
					style={{
						marginBottom: "10px",
						cursor: "pointer",
						textAlign: "center",
					}}
				>
					<b>Código pix</b> (Clique para copiar)
				</TextInfo>

				<TextInfo
					onClick={() => handleClipboard()}
					style={{ fontSize: "14px", cursor: "pointer" }}
				>
					{props.pixValue}
				</TextInfo>
				{showCopy && (
					<TextInfo
						style={{ color: "green", textAlign: "center", marginTop: "10px" }}
					>
						Copiado!
					</TextInfo>
				)}
			</TextInfoContainer>
		</Container>
	);
};

export default QrCodeFull;
