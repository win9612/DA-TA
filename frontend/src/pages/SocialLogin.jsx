/**
 * @author mingyu
 */
import React from "react";
import { useEffect } from "react";
import { kakaoLoginByAuthCode } from "../api/authAPI";
import { Wrapper } from "./../styles/Wrapper";
import { popErrorAlert, popSuccessAlert } from "./../utils/sweetAlert";
import { useNavigate } from "react-router-dom";
import { RoleTypes } from "./../constants/Roles";
import { loadingState, loginState, userState } from "../recoil/Atoms";
import { popWarningAlert } from "./../utils/sweetAlert";
import { useSetRecoilState } from "recoil";

const SocialLogin = () => {
	const navigate = useNavigate();

	const setIsLogin = useSetRecoilState(loginState);
	const setAccountState = useSetRecoilState(userState);
	const setLoading = useSetRecoilState(loadingState);

	const storeToken = (headers) => {
		const accessToken = headers.authorization;
		sessionStorage.setItem("ACCESS_TOKEN", accessToken);
	};

	const storeUserData = (data) => {
		setIsLogin(true);
		setAccountState({
			userId: data.userId,
			nickname: data.nickname,
			role: data.role,
		});
	};

	useEffect(async () => {
		setLoading(true);
		const code = new URL(window.location.href).searchParams.get("code");
		const response = await kakaoLoginByAuthCode(code);
		setLoading(false);

		if (!response || (response.status !== 200 && response.status !== 201)) {
			popErrorAlert("로그인 실패", "로그인 중 문제가 발생했습니다.");
			navigate("/");
			return;
		}

		if (response.data.banStatus.isBan) {
			popWarningAlert("로그인 실패", "해당 유저는 사이트 이용규칙 위반으로 인해 이용정지 상태입니다.");
			navigate("/");
			return;
		}

		storeToken(response.headers);
		storeUserData(response.data);

		popSuccessAlert("로그인 성공", `안녕하세요 <b>${response.data.nickname}</b>님!`);

		navigate("/");
	}, []);
	return (
		<>
			<Wrapper>로그인 중입니다...</Wrapper>
		</>
	);
};

export default SocialLogin;
