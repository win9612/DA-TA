import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../styles/slick.css";
import "../../styles/slick-theme.css";
import { media } from "../../utils/styleUtil";

import {
  popWarningAlert,
  popErrorAlert,
  popSuccessAlert,
} from "./../../utils/sweetAlert";
import { useRecoilValue } from "recoil";
import { loginState } from "./../../recoil/Atoms";

import Footer from "../../components/molecules/Footer";
import MainSeaGradient from "../../components/atoms/MainSeaGradient";
import { MainWave2 } from "../../components/atoms/MainWave2";
import { MainText, MainSmallText } from "../../components/atoms/Text";

import ScrollToTop from "react-scroll-to-top";
import Button from "./../../components/atoms/Button";
import { SizeTypes } from "./../../constants/Sizes";
import BackgroundGradient from "../../components/atoms/BackgroundGradient";
import MouseScrollDownArrowGroup from "../../components/molecules/MouseScrollDownArrowGroup";

import ChatBoxGroup from "../../components/molecules/landing/ChatBoxGroup";
import BottleOfLetterBtn from "../../components/atoms/BottleOfLetterBtn";

import Modal from "../../components/organisms/Modal";
import { QuestionTextArea } from "../../components/atoms/TextArea";
import QuestionProgressBar from "../../components/molecules/landing/QuestionProgressBar";
import { MIN_CHAR_COUNT_Q, MAX_CHAR_COUNT_Q } from "../../constants/Variables";

import { saveTextAnswer } from "../../api/questionWriteAPI";
import { getLetterNum } from "../../api/letterCountAPI";
import { MainAnimationText } from "../../components/atoms/MainAnimationText";
import { userState } from "./../../recoil/Atoms";
import {
  getTodayQuestion,
  getTodayAnswerList,
} from "../../api/questionReadAPI";
import TranslucentBackground from "./../../components/atoms/TranslucentBackground";
import Title from "../../components/atoms/Title";
import Slider from "react-slick";
import SlickArrow from "../../components/atoms/landing/SlickArrow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import ReportAnswerModal from "../../components/organisms/ReportAnswerModal";

const LandingPage = () => {
  const navigate = useNavigate();

  const [chatboxVisible, setChatBoxVisible] = useState(false); // ?????? ????????? ?????? ????????? ??????

  const [charCount, setCharCount] = useState(0); // ????????? ?????? ?????? ?????? ???

  const [modalToggleA, setModalToggleA] = useState(false); // ??????????????? ????????? ??????
  const [modalToggleB, setModalToggleB] = useState(false); // ??????????????? ?????? ????????? ??????

  const [todayQuestionInfo, setTodayQuestionInfo] = useState({}); // ????????? ?????? ?????? (??????, ??????, id)
  const [answerList, setAnswerList] = useState([]); // ????????? ?????? ?????? ?????????
  const [letterCountNum, setLetterCountNum] = useState(0); // ????????? ??? ?????? ?????? ??????
  const [clickPosY, setClickPosY] = useState(0); // ??? ????????? ????????? Y??????
  const [currentAnswerId, setCurrentAnswerId] = useState(0);

  const isLogin = useRecoilValue(loginState); // Recoil ????????? ??????
  const user = useRecoilValue(userState); // Recoil ?????? ??????
  const [reportModalToggle, setReportModalToggle] = useState(false);

  const contentInput = useRef(); // ??????????????? ?????? ?????? ?????? ref (??? ????????????, ref)

  useEffect(() => {
    AOS.init({ duration: 500, easing: "ease-in-out-back" }); //????????? animation ?????? ????????? AOS
    mainGetLetterNum();
    mainGetQuestion();
    setChatBoxVisible(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (todayQuestionInfo.todayQuestionId === undefined) return;
    mainGetAnswerList(todayQuestionInfo.todayQuestionId);
  }, [todayQuestionInfo.todayQuestionId]);

  useEffect(() => {
    let seq = Math.floor(Math.random() * answerList.length);
    setCurrentAnswerId(seq);
  }, [answerList]);

  /**
   * @description ?????? ?????? ?????? open ??? ?????? ??? ?????????
   */
  useEffect(() => {
    setCharCount(0);
  }, [modalToggleA]);

  /**
   * @description ????????? ?????? ?????? ?????? ??? ????????? visible
   */
  useEffect(() => {
    setChatBoxVisible(true);
  }, [clickPosY]);

  /**
   * @description ????????? ?????? ??? ????????? ?????? ??????
   */
  const handleClickBottle = (e) => {
    setClickPosY(e.clientY);
  };

  /**
   * @description [???????????????] ?????? ????????? ??????
   * */
  const handleModalA = () => {
    if (todayQuestionInfo.todayQuestionId >= 0) {
      setChatBoxVisible(false);
      setModalToggleA(true);
    } else {
      popWarningAlert("", "????????? ????????? ????????????.");
    }
  };

  /**
   * @description [???????????????] ?????? ????????? ??????
   * */
  const handleModalB = () => {
    if (answerList.length > 0) {
      setChatBoxVisible(false);
      setModalToggleB(true);
    } else {
      popWarningAlert("", "????????? ?????? ????????? ????????????.");
    }
  };

  /**
   * @description ?????? ????????? ?????? ????????? Button??? isLogin ?????? ??? navigate
   */
  const handleIsLoginCheck = () => {
    return isLogin
      ? navigate("/write")
      : popWarningAlert("", "????????? ??? ??????????????????.");
  };

  /**
   * @description ????????? ?????? ?????? ?????? ??? ?????????
   * @param {number} length
   */
  const handleQuestionAnswerWrite = (length) => {
    setCharCount(length);
  };

  /**
   * @description "?????????" ?????? ????????? ??? ?????????
   */
  const handleAnswerSend = async () => {
    //????????? ??????
    const content = contentInput.current.value;
    if (content.length < MIN_CHAR_COUNT_Q) {
      popWarningAlert(`?????? ????????? ${MIN_CHAR_COUNT_Q}??? ?????? ??????????????????.`);
      return;
    } else if (content.length > MAX_CHAR_COUNT_Q) {
      popWarningAlert(`?????? ????????? ${MAX_CHAR_COUNT_Q}??? ?????? ??????????????????.`);
      return;
    }

    const response = await saveTextAnswer(
      content,
      user.userId,
      todayQuestionInfo.todayQuestionId
    );

    if (!response || (response.status !== 200 && response.status !== 201)) {
      popErrorAlert("?????? ?????? ??????", "?????? ?????? ??? ????????? ??????????????????.");
      return;
    }

    setModalToggleA(false);
    setModalToggleB(false);
    setChatBoxVisible(false);
    setCharCount(0);
    mainGetAnswerList(todayQuestionInfo.todayQuestionId);
    popSuccessAlert("?????? ?????? ??????", "????????? ?????? ????????? ?????????????????????.");
  };

  /**
   * @description ????????? ????????? ?????? ?????? ??????
   */
  const mainGetLetterNum = async () => {
    const response = await getLetterNum();
    if (!response || (response.status !== 200 && response.status !== 201)) {
      setLetterCountNum("-");
      return;
    }
    setLetterCountNum(response.data.letterCount);
  };

  /**
   * @description ????????? ?????? ?????? ??? ??????
   */
  const mainGetQuestion = async () => {
    const response = await getTodayQuestion();
    if (!response || (response.status !== 200 && response.status !== 201)) {
      setTodayQuestionInfo({
        questionId: -1,
        question: "????????? ????????? ????????????.",
        date: new Date(),
      });
      return;
    }
    setTodayQuestionInfo(response.data);
  };

  /**
   * @description ????????? ?????? ?????? ????????? ?????? ??? ??????
   */
  const mainGetAnswerList = async (qId) => {
    const response = await getTodayAnswerList(qId);
    if (!response || (response.status !== 200 && response.status !== 201)) {
      setAnswerList([]);
      return;
    }
    setAnswerList(response.data);
  };

  /**
   * @description ????????? ?????? ?????? ??????
   */
  const handleReportAnswer = async () => {
    setModalToggleB(false);
    setReportModalToggle(true);
  };

  return (
    <>
      {/* ?????? ??? ?????? ?????? Gradient */}
      <BackgroundGradient start={"E2AAFD"} end={"FFDFC2"} />

      {/* ?????? ?????? ?????? ?????? Gradient */}
      <MainSeaGradient />

      {/* ??? ?????? ?????? */}
      <BottleOfLetterBtn onClick={(e) => handleClickBottle(e)} />

      {/* ?????? ?????? ??? ??? ?????? ?????? ?????? */}
      {clickPosY > 10 && chatboxVisible && (
        <TranslucentBackground
          bgColor={"transparent"}
          onClick={() => setChatBoxVisible(false)}
        />
      )}

      {/* ?????? ?????? ??? ???????????? ????????? */}
      {clickPosY > 10 && chatboxVisible && (
        <ChatBoxWrapper clickPosY={clickPosY} chatboxVisible={chatboxVisible}>
          <ChatBoxGroup
            handleModalA={handleModalA}
            handleModalB={handleModalB}
            todayQuestion={todayQuestionInfo.question}
          />
        </ChatBoxWrapper>
      )}

      {/* ??????????????? ?????? ?????? ?????? */}
      {reportModalToggle && (
        <ReportAnswerModal
          modalToggle={reportModalToggle}
          setModalToggle={setReportModalToggle}
          answerId={currentAnswerId}
        />
      )}

      {/* ??????????????? ?????? ???????????? ?????? */}
      {modalToggleA && (
        <Modal
          width="440px"
          height="440px"
          modalToggle={modalToggleA}
          setModalToggle={setModalToggleA}
          titleText={"?????? ??????"}
          flexDirection={"column"}
        >
          <Title fontSize="1rem" color="#383838">
            Q. {todayQuestionInfo.question}
          </Title>
          <AnswerBox width="90%" height="40%" margin="2rem 0 2rem 0">
            <QuestionTextArea
              onChange={(e) => handleQuestionAnswerWrite(e.target.value.length)}
              placeholder="????????? ??????????????????."
              ref={contentInput}
            />
            <QuestionProgressBar charCount={charCount} />
          </AnswerBox>
          <ButtonBox>
            <Button
              margin="0 0 0.25rem 0"
              fontSize="1.1rem"
              height="3rem"
              width="9rem"
              shadow={true}
              color="#5F0EB0"
              borderStyle="2px solid #5F0EB0"
              hoverBgOpacity="0.25"
              hasBorder={false}
              onClick={() => handleAnswerSend()}
            >
              ?????? ?????????
            </Button>
          </ButtonBox>
        </Modal>
      )}

      {/* '?????? ?????? ??????' ?????? ??? ???????????? ?????? */}
      {modalToggleB && (
        <Modal
          width="440px"
          height="440px"
          modalToggle={modalToggleB}
          setModalToggle={setModalToggleB}
          titleText={"?????? ??????"}
          flexDirection={"column"}
        >
          <Title fontSize="1.1rem" color="#383838">
            Q. {todayQuestionInfo.question}
          </Title>
          <AnswerBox width="95%" height="75%" margin="1rem 0 0 0">
            <QuestionAnswerListArea>
              <AnswerReportButton onClick={handleReportAnswer}>
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  style={{
                    color: "#F44336",
                  }}
                  size="2x"
                />
              </AnswerReportButton>
              <StyledSlider
                dots={false}
                infinite={false}
                speed={150}
                slidesToShow={1}
                slidesToScroll={1}
                prevArrow={<SlickArrow direction={"prev"} />}
                nextArrow={<SlickArrow direction={"next"} />}
                initialSlide={currentAnswerId}
                afterChange={(index) => {
                  setCurrentAnswerId(answerList[index].todayAnswerId);
                }}
              >
                {answerList.map((item, index) => (
                  <SliderContent key={index}>{item.answer}</SliderContent>
                ))}
              </StyledSlider>
            </QuestionAnswerListArea>
          </AnswerBox>
        </Modal>
      )}

      {/* ????????? ?????? ??? ???????????? ????????? */}
      <TextWrapper>
        <MainSmallText
          margin="calc(6rem + 5vh) 0 0 0"
          data-aos-duration="500"
          data-aos="flip-up"
        >
          {letterCountNum}?????? ????????? ????????? ??? ????????????
        </MainSmallText>
        <MainAnimationText
          mFont_size={SizeTypes.MOBILE_MAIN_TEXT_SIZE}
          margin="8vh 0 0 0"
        >
          ???????????????! ???? ????????? '??????'??????
        </MainAnimationText>

        <div data-aos="zoom-in-up" data-aos-anchor-placement="bottom-bottom">
          <MainText
            margin="90vh 0 0 0"
            mFont_size={SizeTypes.MOBILE_MAIN_TEXT_SIZE}
          >
            DA-TA????????? ???????????? <br />
            ????????? ???????????? ??? ?????????
          </MainText>
        </div>
        <div data-aos="zoom-in-up" data-aos-anchor-placement="bottom-bottom">
          <MainText
            margin="65vh 0 0 0"
            mFont_size={SizeTypes.MOBILE_MAIN_TEXT_SIZE}
          >
            ??????????????? ????????? ????????? ?????????
            <br />
            ????????? ???????????????
          </MainText>
        </div>
        <div data-aos="zoom-in-up" data-aos-anchor-placement="bottom-bottom">
          <MainText
            margin="65vh 0 0 0"
            mFont_size={SizeTypes.MOBILE_MAIN_TEXT_SIZE}
          >
            ?????? ?????????! <br /> ??????????????? ?????? ?????? ?????? ??????????
          </MainText>
        </div>
        <div data-aos="zoom-in-up" data-aos-anchor-placement="bottom-bottom">
          <MainText
            margin="65vh 0 0 0"
            mFont_size={SizeTypes.MOBILE_MAIN_TEXT_SIZE}
          >
            ????????? ????????? '??????'??? ???????????????!
          </MainText>
        </div>

        <br />
        <div
          data-aos="zoom-in-up"
          data-aos-duration="1000"
          data-aos-anchor-placement="bottom-bottom"
        >
          <Button
            hoverBgOpacity="0.5"
            fontSize="1.4rem"
            height="3rem"
            width="18rem"
            margin="1% 0 0 0"
            shadow={true}
            onClick={() => handleIsLoginCheck()}
          >
            ???? &nbsp; ?????? ????????? &nbsp; ????
          </Button>
        </div>
      </TextWrapper>

      {/* ?????? ????????? ?????? arrow */}
      <MouseScrollDownArrowWrapper>
        <MouseScrollDownArrowGroup />
      </MouseScrollDownArrowWrapper>

      {/* ?????? ?????? */}
      <MainWave2 opacity={0.4} frequency={16} isRight={false} zIndex="5" />
      <MainWave2 opacity={0.6} frequency={13} isRight={false} zIndex="6" />
      <MainWave2 opacity={0.6} frequency={20} isRight={false} zIndex="3" />
      <MainWave2 opacity={0.6} frequency={20} isRight={true} zIndex="8" />
      <MainWave2 opacity={0.4} frequency={16} isRight={true} zIndex="1" />
      <MainWave2 opacity={0.3} frequency={13} isRight={true} zIndex="2" />
      <MainWave2 opacity={0.7} frequency={20} isRight={true} zIndex="4" />

      {/* ??? ?????? ?????? */}
      <ScrollToTop
        smooth
        color="#ffffff"
        strokeWidth="px"
        style={{
          backgroundColor: "rgba( 255, 255, 255, 0.4 )",
          borderRadius: "100%",
          border: "4px solid #ffffff",
          width: "4rem",
          height: "4rem",
          margin: "0 1% 1% 0",
          // strokeWidth: "7",
        }}
      />

      {/* ?????? */}
      <Footer />
    </>
  );
};

const TextWrapper = styled.div`
  display: flex;
  position: absolute;
  width: 100vw;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MouseScrollDownArrowWrapper = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  z-index: 10;
  bottom: 20vh;
  left: 50%;
  background-color: yellow;
  opacity: 0.7;

  ${media.phone`
  	top: 65%;
	`};
`;

const ChatBoxWrapper = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  top: calc(${(props) => props.clickPosY}px - 180px);
  left: 50%;
  z-index: 1001;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transform: ${(props) => (props.chatboxVisible ? `scaleY(1)` : `scaleY(0)`)};
  transition: 3s ease;
  transition-delay: 5s;

  ${media.tablet1`
  top: 20rem;
`};
  ${media.phone`
  top: 12rem;
`};
`;

const AnswerBox = styled.div`
  display: flex;
  background-color: transparent;
  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  font-size: ${(props) => props.fontSize};
  filter: ${(props) =>
    props.shadow ? "drop-shadow(4px 8px 12px rgba(38,38,38,0.5))" : ""};
  border: ${(props) =>
    props.hasBorder ? "2px solid black" : props.borderStyle};
  border-radius: ${(props) => props.borderRadius};
  color: ${(props) => props.color || "black"};
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  z-index: ${(props) => props.zIndex};

  position: relative;
  left: 50%;
  transform: translate(-50%, 0%);

  transition: all 0.2s ease-in;

  ${media.phone`
      width: ${(props) => (props.mWidth ? props.mWidth : props.width)};
  `}
`;

const ButtonBox = styled.div`
  display: flex;
  position: absolute;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  bottom: 1rem;
  left: 50%;
  transform: translate(-50%, 0%);
`;

const QuestionAnswerListArea = styled.div`
	display: flex;
	resize: none;
	align-items: center;
	justify-content: center;
	text-align; center;
	width: 100%;
	height: 100%;
	padding: 0rem;
	box-sizing: border-box;
	background: transparent;
	font-size: 1rem;
	line-height: 1.5rem;
	color: black;
`;

const StyledSlider = styled(Slider)`
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 16px;
  width: 100%;
  height: 90%;
  padding: 0.5rem;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  text-align: center;

  .slack-list {
    width: 100%;
    margin: 0 auto;
  }
`;

const SliderContent = styled.div`
  display: flex;
  width: 80%;
  height: auto;
  padding: 0rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  white-space: normal;
  word-wrap: break-all;
  word-break: break-all;
`;

const AnswerReportButton = styled.button`
  display: flex;
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 2rem;
  height: 2rem;
  padding: 0.5rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  background: transparent;
  z-index: 500;
`;

export default LandingPage;
