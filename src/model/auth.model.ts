export class RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export class LoginRequest {
  email: string;
  password: string;
}

export class VerifyEmailRequest {
  token: string;
}

export class ForgotPasswordRequest {
  email: string;
}

export class ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
