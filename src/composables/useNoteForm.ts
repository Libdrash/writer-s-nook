import { watch, type Ref } from "vue";
import { useField, useForm } from "vee-validate";
import * as zod from "zod";
import type { NoteForm } from "../types/note";
import { toTypedSchema } from "@vee-validate/zod";

export function useNoteForm(
  submit: Function,
  initialData?: Ref<NoteForm | null> | NoteForm,
) {
  const validationSchema = toTypedSchema(
    zod.object({
      title: zod
        .string()
        .min(1, "Введите название")
        .min(2, "Минимум 2 символа"),
      content: zod.string().optional(),
    }),
  );

  const { handleSubmit, resetForm } = useForm({
    validationSchema: validationSchema,
  });

  const {
    value: title,
    errorMessage: titleError,
    handleBlur: titleBlur,
  } = useField("title");
  const {
    value: content,
    errorMessage: contentError,
    handleBlur: contentBlur,
  } = useField("content");

  if (
    initialData &&
    typeof initialData === "object" &&
    "value" in initialData
  ) {
    watch(
      initialData,
      (newData) => {
        if (newData) {
          title.value = newData.title;
          content.value = newData.content;
        }
      },
      { immediate: true },
    );
  } else if (initialData) {
    // Если передан обычный объект
    title.value = initialData.title;
    content.value = initialData.content;
  }

  const onSubmit = handleSubmit(async (values) => {
    await submit(values);
    resetForm();
  });

  const setValues = (values: NoteForm) => {
    title.value = values.title;
    content.value = values.content;
  };

  return {
    title,
    titleError,
    titleBlur,
    content,
    contentError,
    contentBlur,
    onSubmit,
    setValues,
    resetForm,
  };
}
