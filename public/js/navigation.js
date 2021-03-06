//wraps functions in object to prevent global namespace pollution
const navigation = {
    signUp: async () => {

        const signUp = navigation.signUpValues();
        const valid = navigation.validSignUp(signUp);
        const errorDisplay = ELEMENTS.NAVIGATION.MODAL.SIGN_UP.MSG_DISPLAY;

        common.clearFormErrors(errorDisplay, Object.values(ELEMENTS.NAVIGATION.MODAL.SIGN_UP.INPUT));

        if (valid) {
            await $.ajax({
                url:'/register',
                method:'POST',
                data:{
                    email: signUp.email,
                    password: signUp.password
                },
                statusCode:{
                    200:()=>{
                        const successMsgs = ['Sign up successful please sign in!'];
                        const successDisplay = ELEMENTS.NAVIGATION.MODAL.LOGIN.MSG_DISPLAY;
                        common.toggleModal(ELEMENTS.NAVIGATION.MODAL.SIGN_UP.ID,false);
                        common.toggleModal(ELEMENTS.NAVIGATION.MODAL.LOGIN.ID,true);
                        common.displayMessages(successDisplay,successMsgs,'16px','green','bold');
                    },
                    500:()=>{
                        const errorMessage = ['*Unable to process sign up at this time'];
                        const errorDisplay = ELEMENTS.NAVIGATION.MODAL.SIGN_UP.MSG_DISPLAY;
                        const effectedInputs = Object.values(ELEMENTS.NAVIGATION.MODAL.SIGN_UP.INPUT);
                        common.formErrors(errorMessage,errorDisplay,effectedInputs);
                    }
                }
            });
        }else {
            common.formErrors(signUp.errorMsgs, errorDisplay, signUp.errorInputs);
        }
    },
    login: async () => {

        const login = navigation.loginValues();
        const valid = navigation.validLogin(login);

        common.clearFormErrors(
            ELEMENTS.NAVIGATION.MODAL.LOGIN.MSG_DISPLAY,
            Object.values(ELEMENTS.NAVIGATION.MODAL.LOGIN.INPUT)
        );

        if (valid) {
            return await $.ajax({
                url:'/verify',
                method:'POST',
                data:{
                    email: login.email,
                    password: login.password
                },
                statusCode:{
                    200:()=>{
                        return true;
                    },
                    401:()=>{
                        console.log('bad login');
                        const errorMessage = ['*Incorrect e-mail or password'];
                        const errorDisplay = ELEMENTS.NAVIGATION.MODAL.LOGIN.MSG_DISPLAY;
                        const effectedInputs = Object.values(ELEMENTS.NAVIGATION.MODAL.LOGIN.INPUT);
                        common.formErrors(errorMessage, errorDisplay, effectedInputs);
                        return false;
                    }
                }
            });

        } else {
            common.formErrors(login.errorMsgs, ELEMENTS.NAVIGATION.MODAL.LOGIN.MSG_DISPLAY, login.errorInputs);
            return false;
        }
    },
    validLogin: (login) => {

        if (!common.validPassword(login.password) || !common.validEmail(login.email)) {
            login.errors = true;
            login.errorMsgs.push('*Invalid e-mail or password');
            login.errorInputs.push(ELEMENTS.NAVIGATION.MODAL.LOGIN.INPUT.EMAIL);
            login.errorInputs.push(ELEMENTS.NAVIGATION.MODAL.LOGIN.INPUT.PASSWORD);
        }

        return !login.errors;
    },
    validSignUp: (signUp) => {

        const validEmail = navigation.validateSignUpEmail(signUp);
        const validPassword = navigation.validateSignUpPassword(signUp);

        return validEmail && validPassword;
    },
    validateSignUpEmail: (signUp) => {

        if (!common.validEmail(signUp.email)) {
            signUp.errors = true;
            signUp.errorMsgs.push('*Invalid e-mail');
            signUp.errorInputs.push(ELEMENTS.NAVIGATION.MODAL.SIGN_UP.INPUT.EMAIL);
        } else {
            if (!common.match(signUp.email, signUp.confirmEmail)) {
                signUp.errors = true;
                signUp.errorMsgs.push('*E-mails do not match');
                signUp.errorInputs.push(ELEMENTS.NAVIGATION.MODAL.SIGN_UP.INPUT.CONFIRM_EMAIL);
            }
        }

        return !signUp.errors;
    },
    validateSignUpPassword: (signUp) => {

        if (!common.validPassword(signUp.password)) {
            signUp.errors = true;
            signUp.errorMsgs.push('*Invalid password');
            signUp.errorInputs.push(ELEMENTS.NAVIGATION.MODAL.SIGN_UP.INPUT.PASSWORD);
        } else {
            if (!common.match(signUp.password, signUp.confirmPass)) {
                signUp.errors = true;
                signUp.errorMsgs.push('*Passwords do not match');
                signUp.errorInputs.push(ELEMENTS.NAVIGATION.MODAL.SIGN_UP.INPUT.CONFIRM_PASSWORD);
            }
        }

        return !signUp.errors;
    },
    loginValues: () => {

        const input = ELEMENTS.NAVIGATION.MODAL.LOGIN.INPUT;

        return {
            email: $(input.EMAIL).val(),
            password: $(input.PASSWORD).val(),
            errors: false,
            errorMsgs: [],
            errorInputs: []
        }
    },
    signUpValues: () => {

        const input = ELEMENTS.NAVIGATION.MODAL.SIGN_UP.INPUT;

        return {
            email: $(input.EMAIL).val(),
            confirmEmail: $(input.CONFIRM_EMAIL).val(),
            password: $(input.PASSWORD).val(),
            confirmPass: $(input.CONFIRM_PASSWORD).val(),
            errors: false,
            errorMsgs: [],
            errorInputs: []
        };
    }
};

$(document).ready(()=>{
    common.setUpModalForm(ELEMENTS.NAVIGATION.MODAL.LOGIN,navigation.login);
    common.setUpModalForm(ELEMENTS.NAVIGATION.MODAL.SIGN_UP,navigation.signUp);
});