import { SignUpService } from "#modules/auth/services/sign-up/index.js";

export const createUser = () => SignUpService.createSignUpHandler({ extended: true });