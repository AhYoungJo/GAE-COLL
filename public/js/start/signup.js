let authEmailNum = "";
let isAuth = false;
//이메일 인증번호 전송
async function emailAuth() {
    const email = document.querySelector("#email").value;
    const emailAuthBtn = document.querySelector("#email-auth-btn");

    const emailSendResult = await axios({
        method: "POST",
        url: "/api/user/emailAuth",
        data: {
            email,
        },
    });
    const { success, result } = emailSendResult.data;
    if (success) {
        authEmailNum = String(result.authNum);
        alert("기입하신 이메일로 인증번호가 전송되었습니다");

        emailAuthBtn.classList.remove("hidden");
    } else {
        alert("인증번호 전송에 실패하였습니다.");
    }
}
//이메일 인증번호 확인
async function checkEmailAuthNum() {
    const inputAuthNum = document.querySelector("#email-number").value;
    console.log("inputAuthNum", typeof inputAuthNum);
    console.log("authEmailNum", typeof authEmailNum);
    console.log(inputAuthNum === authEmailNum);
    if (inputAuthNum === authEmailNum) {
        alert("이메일 인증이 완료되었습니다.");
        isAuth = true;
    } else {
        alert("인증번호를 확인해주세요");
        isAuth = false;
    }
}

//회원가입
async function emailSignup() {}
