import { watch, type Ref, ref } from "vue";
import { useField, useForm } from "vee-validate";
import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import type { ProfileForm } from "../types/profile";

export function useProfileForm(
  submit: Function,
  initialData?: Ref<ProfileForm | null> | ProfileForm,
) {
  const validationSchema = toTypedSchema(
    zod.object({
      fio: zod
        .string("Это обязательное поле")
        .min(1, "Введите ФИО")
        .min(2, "Минимум 2 символа"),
      photoUrl: zod.string().optional().nullable(),
      pseudonym: zod.string().optional().nullable(),
    }),
  );

  const { handleSubmit, resetForm } = useForm<ProfileForm>({
    validationSchema: validationSchema,
    initialValues: {
      fio: "",
      photoUrl: "",
      pseudonym: "",
    },
  });

  const {
    value: fio,
    errorMessage: fioError,
    handleBlur: fioBlur,
  } = useField("fio");
  const { value: photoUrl, errorMessage: photoUrlError } = useField("photoUrl");
  const { value: pseudonym, errorMessage: pseudonymError } =
    useField("pseudonym");

  // Флаг для предотвращения лишних обновлений
  const isUpdatingFromStore = ref(false);

  const updateFormFromData = (data: ProfileForm) => {
    if (isUpdatingFromStore.value) return;

    isUpdatingFromStore.value = true;
    resetForm({
      values: {
        fio: data.fio || "",
        photoUrl: data.photoUrl || "",
        pseudonym: data.pseudonym || "",
      },
    });
    isUpdatingFromStore.value = false;
  };

  if (
    initialData &&
    typeof initialData === "object" &&
    "value" in initialData
  ) {
    watch(
      initialData,
      (newData) => {
        if (newData) {
          updateFormFromData(newData);
        }
      },
      { immediate: true, deep: true },
    );
  } else if (initialData) {
    updateFormFromData(initialData);
  }

  const onSubmit = handleSubmit(async (values) => {
    await submit(values);
  });

  const setValues = (values: ProfileForm) => {
    isUpdatingFromStore.value = true;
    resetForm({
      values: {
        fio: values.fio || "",
        photoUrl: values.photoUrl || "",
        pseudonym: values.pseudonym || "",
      },
    });
    isUpdatingFromStore.value = false;
  };

  return {
    fio,
    fioError,
    fioBlur,
    photoUrl,
    photoUrlError,
    pseudonym,
    pseudonymError,
    onSubmit,
    setValues,
    resetForm,
  };
}
