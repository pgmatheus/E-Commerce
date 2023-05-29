import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import { publicRequest } from "../requestMethods";
import { Refresh } from "@material-ui/icons";
import { keyframes, css } from "styled-components";

const Container = styled.div`
  display: inline-block;
`;
const RecaptchaDiv = styled.div`
  border: 1px solid white;
  width: 300px;
  /* height: 74px; */
  display: flex;
  background-color: #f9f9f9;
`;

const hourglass = keyframes`
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
`;

const Spinner = styled.div`
  display: inline-block;
  ::after {
    content: " ";
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    // margin: 4px;
    box-sizing: border-box;
    /* border: 8px solid #fff;
		border-color: #fff transparent #fff transparent; */

    border: ${(props) =>
      props.custom === undefined
        ? "8px solid white"
        : `${props.custom.size || "8px"} solid ${
            props.custom.color || "white"
          }`};
    border-color: ${(props) =>
      props.custom === undefined
        ? " white transparent white transparent"
        : `${props.custom.color || "white"} transparent ${
            props.custom.color || "white"
          } transparent`};

    animation: ${css`
      ${hourglass} 1.2s infinite
    `};
  }
`;

const RecaptchaCheckboxContainer = styled.div`
  width: 52px;
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RecaptchaCheckbox = styled.input`
  width: 27.2px;
  height: 27.2px;
  border: 1px solid #d3d3d3;
`;

const RecaptchaTextContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 152px;
  height: 74px;
`;

const RecaptchaText = styled.p``;

const RecaptchaSimbolContainer = styled.div`
  width: 96px;
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Symbol = styled.img`
  height: 90%;
`;

const RecaptchaWindowavContainer = styled.div`
  width: 100%;
  /* max-width: 400px; */
  /* height: 100%; */
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
`;

const HeaderCaptcha = styled.div`
  box-sizing: border-box;
  color: white;
  width: 100%;
  height: 150px;
  background-color: #168aad;
  border: 5px solid white;
`;

const HeaderCaptchaText = styled.div`
  box-sizing: border-box;
  padding: 25px;
  display: flex;
  height: 100%;
  justify-content: center;
  flex-direction: column;
`;

const CaptchaPhotoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  /* height: calc(100% - 160px - 100px); */
`;

const CaptchaPhoto = styled.img`
  box-sizing: border-box;
  width: calc(100% / 3 - 10px);
  aspect-ratio: 1 / 1;
  /* border: 5px solid white; */
  border: ${(props) =>
    props.selected == 1 ? "5px solid #a2a8d3" : "5px solid white"};
  margin: 5px;
  object-fit: cover;
  cursor: pointer;
  /* &:hover {
		border: 5px solid lightgray;
	} */
`;

const CaptchaButtonContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const CaptchaButton = styled.input`
  border-radius: 4px;
  background-color: #168aad;
  width: 100px;
  height: 35px;
  cursor: pointer;
  &:hover {
    background-color: #1b9bc2;
  }
`;

const Recaptcha = (props) => {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [selCaptcha, setSelCaptcha] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [imgCaptcha, setImgCaptcha] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    props.func2(showImg);
  }, [showImg]);

  useEffect(() => {
    props.func(token);
  }, [token]);

  const handleGetCaptcha = () => {
    if (!checked) {
      setLoading(true);
      setSelCaptcha([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const sendCaptcha = async () => {
        try {
          const res = await publicRequest.post("/recapcha");
          if (res.data && res.data.token) {
            setChecked(true);
            setToken(res.data.token);
          } else {
            setImgCaptcha(res.data.arrCaptcha);
            setShowImg(true);
          }
        } catch (err) {}
      };
      sendCaptcha();
      setLoading(false);
    }
  };

  const handleSetCaptcha = (i) => {
    if (selCaptcha[i] == 0) {
      setSelCaptcha(updateArr(selCaptcha, i, 1));
    } else {
      setSelCaptcha(updateArr(selCaptcha, i, 0));
    }
  };

  const updateArr = (arr, i, updatedV) => {
    try {
      let updatedArrN = [
        ...arr.slice(0, i),
        updatedV,
        ...arr.slice(i + 1, arr.length),
      ];
      return updatedArrN;
    } catch {}
  };

  const handleVerifyCaptcha = () => {
    try {
      const sendVerifyCaptcha = async () => {
        const verifyCaptchaArr = await publicRequest.post("/verifyrecapcha", {
          captchaArr: selCaptcha,
        });

        if (verifyCaptchaArr && verifyCaptchaArr.data.token) {
          setChecked(true);
          setToken(verifyCaptchaArr.data.token);
          setShowImg(false);
        } else {
          handleGetCaptcha();
        }
      };
      sendVerifyCaptcha();
    } catch (err) {}
  };

  return (
    <Container>
      <RecaptchaDiv>
        {showImg && (
          <RecaptchaWindowavContainer>
            <HeaderCaptcha>
              <HeaderCaptchaText>
                <p>Por favor, selecione quadrados com</p>
                <p style={{ fontSize: "25px", fontWeight: "bold" }}>
                  Cachorros
                </p>
                <p>Se não houver nenhum, clicar em CONTINUAR</p>
              </HeaderCaptchaText>
            </HeaderCaptcha>

            <CaptchaPhotoContainer>
              {imgCaptcha.map((e, i) => (
                <CaptchaPhoto
                  selected={selCaptcha[i]}
                  src={e}
                  onClick={() => handleSetCaptcha(i)}
                  key={i}
                ></CaptchaPhoto>
              ))}
            </CaptchaPhotoContainer>

            <CaptchaButtonContainer>
              <Refresh
                onClick={() => handleGetCaptcha()}
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              />
              <CaptchaButton
                onClick={() => handleVerifyCaptcha()}
                type="button"
                value="VERIFICAR"
              ></CaptchaButton>
            </CaptchaButtonContainer>
          </RecaptchaWindowavContainer>
        )}
        <RecaptchaCheckboxContainer>
          {loading ? (
            <Spinner />
          ) : (
            <RecaptchaCheckbox
              onClick={() => handleGetCaptcha()}
              type="checkbox"
              checked={checked}
              onChange={() => true}
            ></RecaptchaCheckbox>
          )}
        </RecaptchaCheckboxContainer>
        <RecaptchaTextContainer>
          <RecaptchaText>Não sou um robô</RecaptchaText>
        </RecaptchaTextContainer>
        <RecaptchaSimbolContainer>
          <Symbol src="https://dm2304files.storage.live.com/y4mYp8fY7fz_ClafdcOijcpCv2Bp8aJoKTFKbNy6teNNH3oImkinDSGRZpX_yE6BOnbVkoFK_oWsQjJmRU8Z8BpbE51svbu9zd_u0j1zq_HNE3FN-B0zJrGEhMoBtX253Zy2gmrhfhtLZqs8QgZ5iJ9UQ1v5YUb2avuptKbWI4SL0TeXO61g7TSW7-SvNBpMt3Q?width=220&height=220&cropmode=none"></Symbol>
        </RecaptchaSimbolContainer>
      </RecaptchaDiv>
    </Container>
  );
};

export default Recaptcha;
