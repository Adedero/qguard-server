import { SignUpService } from "../services/sign-up/index.js";

export const signUp = () => SignUpService.createSignUpHandler();
