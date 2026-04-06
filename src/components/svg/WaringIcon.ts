import { defineComponent, h } from "vue";

export const WaringIcon = defineComponent({
  name: "WaringIcon",
  props: {
    width: { type: Number, default: 24 },
    height: { type: Number, default: 24 },
    color: { type: String, default: "#D4183D" },
    strokeWidth: { type: Number, default: 2 },
  },
  setup(props) {
    return () =>
      h(
        "svg",
        {
          viewBox: "0 0 24 24",
          width: props.width,
          height: props.height,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        [
          h("path", {
            d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z",
            stroke: props.color,
            "stroke-width": props.strokeWidth.toString(),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
          h("path", {
            d: "M12 8V12",
            stroke: props.color,
            "stroke-width": props.strokeWidth.toString(),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
          h("path", {
            d: "M12 16H12.01",
            stroke: props.color,
            "stroke-width": props.strokeWidth.toString(),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
        ],
      );
  },
});
