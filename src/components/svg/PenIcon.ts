// PenIcon.ts
import { defineComponent, h } from "vue";

export const PenIcon = defineComponent({
  name: "PenIcon",
  props: {
    width: { type: Number, default: 32 },
    height: { type: Number, default: 32 },
    color: { type: String, default: "#212529" }, // Тёмно-серый по умолчанию
    strokeWidth: { type: Number, default: 2.66667 },
  },
  setup(props) {
    return () =>
      h(
        "svg",
        {
          viewBox: "0 0 32 32",
          width: props.width,
          height: props.height,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        [
          // Основная часть пера (наконечник)
          h("path", {
            d: "M20.9412 28.3906C20.6911 28.6406 20.352 28.781 19.9985 28.781C19.6449 28.781 19.3059 28.6406 19.0558 28.3906L16.9412 26.276C16.6912 26.0259 16.5508 25.6868 16.5508 25.3333C16.5508 24.9797 16.6912 24.6407 16.9412 24.3906L24.3892 16.9426C24.6392 16.6927 24.9783 16.5522 25.3318 16.5522C25.6854 16.5522 26.0245 16.6927 26.2745 16.9426L28.3892 19.0573C28.6391 19.3073 28.7795 19.6464 28.7795 20C28.7795 20.3535 28.6391 20.6926 28.3892 20.9426L20.9412 28.3906Z",
            stroke: props.color,
            "stroke-width": props.strokeWidth.toString(),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
          // Стержень пера
          h("path", {
            d: "M24.0013 17.3332L22.168 8.16785C22.1181 7.91848 21.998 7.68858 21.8217 7.50526C21.6455 7.32194 21.4205 7.19283 21.1733 7.13318L4.31464 2.70385C4.09255 2.65015 3.86038 2.65443 3.64041 2.71627C3.42045 2.77812 3.22006 2.89546 3.05849 3.05703C2.89692 3.2186 2.77958 3.41898 2.71774 3.63895C2.65589 3.85891 2.65161 4.09108 2.70531 4.31318L7.13464 21.1718C7.1943 21.419 7.3234 21.644 7.50673 21.8203C7.69005 21.9965 7.91995 22.1166 8.16931 22.1665L17.3346 23.9998",
            stroke: props.color,
            "stroke-width": props.strokeWidth.toString(),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
          // Диагональная линия (деталь)
          h("path", {
            d: "M3.06641 3.06689L12.7811 12.7816",
            stroke: props.color,
            "stroke-width": props.strokeWidth.toString(),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
          // Круглая деталь (кнопка/декор)
          h("path", {
            d: "M14.6667 17.3333C16.1394 17.3333 17.3333 16.1394 17.3333 14.6667C17.3333 13.1939 16.1394 12 14.6667 12C13.1939 12 12 13.1939 12 14.6667C12 16.1394 13.1939 17.3333 14.6667 17.3333Z",
            stroke: props.color,
            "stroke-width": props.strokeWidth.toString(),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
        ],
      );
  },
});
