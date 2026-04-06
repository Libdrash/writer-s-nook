const ERROR_CODES: Record<string, string> = {
  INVALID_LOGIN_CREDENTIALS: "Неправильный email или пароль",
  INVALID_ARGUMENT: "Неправильный email или пароль",
  PERMISSION_DENIED: "Недостаточно прав",
  "Missing or insufficient permissions.": "Недостаточно прав",
  auth: "Вы не авторизованы",
  "Missing or invalid authentication.":
    "Истекло время сессии. Пожалуйста, авторизуйтесь заново",
};

export const error = (code?: string, custom?: boolean) => {
  if (code && ERROR_CODES[code]) {
    return ERROR_CODES[code];
  }

  if (custom) return code;
  return "Неизвестная ошибка";
};
