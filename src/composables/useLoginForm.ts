import { useField, useForm } from "vee-validate";
import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useAuthStore } from "../stores/useAuthStore";
import { useRouter } from "vue-router";

const baseSchema = zod.object({
  email: zod
    .string("Это поле обязательное")
    .min(1, { message: "Это поле обязательное" })
    .email({ message: "Некорректный email" }),
  password: zod
    .string("Это поле обязательное")
    .min(1, { message: "Это поле обязательное" })
    .min(6, { message: "Минимум 6 символов" }),
});

const schemaWithAgreement = baseSchema.extend({
  agreement: zod.boolean().refine((val) => val === true, {
    message: "Необходимо подтверждение",
  }),
});

export const useLoginForm = (withAgree?: boolean) => {
  const store = useAuthStore();
  const router = useRouter();

  const validationSchema = withAgree ? schemaWithAgreement : baseSchema;

  const { handleSubmit, isSubmitting, errors } = useForm({
    validationSchema: toTypedSchema(validationSchema),
  });

  const {
    value: email,
    errorMessage: emailError,
    handleBlur: emailBlur,
  } = useField("email");
  const {
    value: password,
    errorMessage: passwordError,
    handleBlur: passwordBlur,
  } = useField("password");

  const {
    value: agreement,
    errorMessage: agreementError,
    handleBlur: agreementBlur,
  } = useField("agreement");

  const onSubmitLogin = handleSubmit(async (values) => {
    try {
      await store.login(values);
      router.push("/");
    } catch (e) {}
  });
  const onSubmitSignIn = handleSubmit(async (values) => {
    try {
      await store.signUp(values);
      router.push("/");
    } catch (e) {}
  });

  return {
    onSubmitLogin,
    onSubmitSignIn,
    isSubmitting,
    email,
    emailError,
    emailBlur,
    password,
    passwordError,
    passwordBlur,
    errors,
    agreement,
    agreementError,
    agreementBlur,
  };
};
