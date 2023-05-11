export default function Mail(color: string) {
  return (
    <>
      <rect
        fill="none"
        stroke={color}
        strokeWidth="2"
        width="20"
        height="16"
        x="2"
        y="4"
        rx="2"
      ></rect>
      <path
        fill="none"
        stroke={color}
        strokeWidth="2"
        d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
      ></path>
    </>
  );
}
