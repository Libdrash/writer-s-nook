import { useField, useForm } from "vee-validate";
import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import type { BookForm } from "../types/book";

const validationSchema = toTypedSchema(
  zod.object({
    title: zod.string().min(1, "Введите название").min(2, "Минимум 2 символа"),
    author: zod.string().min(1, "Введите автора").min(2, "Минимум 2 символа"),
    year: zod.number().nullable().optional(),
    genre: zod.string().optional(),
    coverUrl: zod.string().url("Некорректный URL").optional().nullable(),
    rating: zod.number().nullable().optional(),
    status: zod.string().min(1, "Выберите статус"),
  }),
);

export type BookFormValues = zod.infer<typeof validationSchema>;

export const useBookForm = (
  onSubmit?: (values: BookForm) => void | Promise<void>,
  initialValues?: BookForm | null,
) => {
  const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema,
    initialValues: initialValues || {
      title: "",
      author: "",
      year: null,
      genre: "",
      coverUrl: null,
      rating: null,
      status: "Хочу прочитать",
    },
  });

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

  const {
    value: rating,
    errorMessage: ratingError,
    handleBlur: ratingBlur,
  } = useField<number | null>("rating");

  const {
    value: status,
    errorMessage: statusError,
    handleBlur: statusBlur,
  } = useField<string>("status");

  const onSubmitForm = handleSubmit(async (values) => {
    if (onSubmit) {
      await onSubmit(values as BookForm);
    }
  });

  const resetFormWithValues = (values?: BookForm | null) => {
    resetForm({
      values: values || {
        title: "",
        author: "",
        year: null,
        genre: "",
        coverUrl: null,
        rating: null,
        status: "Хочу прочитать",
      },
    });
  };

  return {
    onSubmit: onSubmitForm,
    isSubmitting,
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
    rating,
    ratingError,
    ratingBlur,
    status,
    statusError,
    statusBlur,
    resetForm,
    resetFormWithValues,
  };
};
