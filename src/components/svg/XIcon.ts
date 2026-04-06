import { defineComponent, h } from "vue";

export const XIcon = defineComponent({
  name: "XIcon",
  props: {
    width: { type: Number, default: 16 },
    height: { type: Number, default: 16 },
    color: { type: String, default: "#6C757D" },
    strokeWidth: { type: Number, default: 1.33333 },
  },
  setup(props) {
    return () =>
      h(
        "svg",
        {
          viewBox: "0 0 16 16",
          width: props.width,
          height: props.height,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        [
          h("path", {
            d: "M12 4L4 12",
            stroke: props.color,
            "stroke-width": props.strokeWidth.toString(),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
          h("path", {
            d: "M4 4L12 12",
            stroke: props.color,
            "stroke-width": props.strokeWidth.toString(),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
        ],
      );
  },
});
