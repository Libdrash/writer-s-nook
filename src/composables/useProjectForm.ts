import { useField, useForm } from "vee-validate";
import type { PublicProjectForm } from "../types/project";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { watch, type Ref } from "vue";

const validationSchema = toTypedSchema(
  zod.object({
    title: zod.string().min(1, "Введите название").min(2, "Минимум 2 символа"),
    author: zod.string().min(1, "Введите автора").min(2, "Минимум 2 символа"),
    year: zod.string().nullable().optional(),
    genre: zod.string().optional(),
    coverUrl: zod.string().url("Некорректный URL").optional().nullable(),
  }),
);

export type BookFormValues = zod.infer<typeof validationSchema>;

export const useProjectForm = (
  onSubmit?: (values: PublicProjectForm) => void | Promise<void>,
  initialData?: Ref<PublicProjectForm | null> | PublicProjectForm,
) => {
  const { handleSubmit, isSubmitting, resetForm, setValues } =
    useForm<PublicProjectForm>({
      validationSchema,
    });

  watch(
    () => {
      if (!initialData) return null;
      if (typeof initialData === "object" && "value" in initialData) {
        return initialData.value;
      }
      return initialData;
    },
    (newValues) => {
      if (newValues) {
        setValues(newValues);
      }
    },
    { immediate: true, deep: true },
  );

  const {
    value: title,
    errorMessage: titleError,
    handleBlur: titleBlur,
  } = useField<string>("title");

  const {
    value: author,
    errorMessage: authorError,
    handleBlur: authorBlur,
  } = useField<string>("author");

  const {
    value: year,
    errorMessage: yearError,
    handleBlur: yearBlur,
  } = useField<number | null>("year");

  const {
    value: genre,
    errorMessage: genreError,
    handleBlur: genreBlur,
  } = useField<string>("genre");

  const {
    value: coverUrl,
    errorMessage: coverUrlError,
    handleBlur: coverUrlBlur,
  } = useField<string | null>("coverUrl");

  const onSubmitForm = handleSubmit(async (values) => {
    if (onSubmit) {
      await onSubmit(values as PublicProjectForm);
    }
  });

  return {
    isSubmitting,
    onSubmitForm,
    resetForm,
    title,
    titleError,
    titleBlur,
    author,
    authorError,
    authorBlur,
    year,
    yearError,
    yearBlur,
    genre,
    genreError,
    genreBlur,
    coverUrl,
    coverUrlError,
    coverUrlBlur,
  };
};
