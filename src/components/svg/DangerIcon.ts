import { defineComponent, h } from "vue";

export const DangerIcon = defineComponent({
  name: "DangerIcon",
  props: {
    width: { type: Number, default: 20 },
    height: { type: Number, default: 20 },
    color: { type: String, default: "#D4183D" },
    strokeWidth: { type: Number, default: 1.66667 },
  },
  setup(props) {
    return () =>
      h(
        "svg",
        {
          viewBox: "0 0 20 20",
          width: props.width,
          height: props.height,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        [
          h("path", {
            d: "M9.85677 18.6667C14.4591 18.6667 18.1901 14.9357 18.1901 10.3333C18.1901 5.73096 14.4591 2 9.85677 2C5.2544 2 1.52344 5.73096 1.52344 10.3333C1.52344 14.9357 5.2544 18.6667 9.85677 18.6667Z",
            stroke: props.color,
            "stroke-width": props.strokeWidth.toString(),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
          h("path", {
            d: "M10 6.66699V10.0003",
            stroke: props.color,
            "stroke-width": props.strokeWidth.toString(),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
          h("path", {
            d: "M10 13.333H10.0083",
            stroke: props.color,
            "stroke-width": props.strokeWidth.toString(),
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
        ],
      );
  },
});
