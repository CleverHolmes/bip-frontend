export default function Folder(color: string) {
  return (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.56561 1.39886C2.03445 0.930018 2.67033 0.666626 3.33337 0.666626H6.61268C7.02445 0.668756 7.42932 0.772575 7.79131 0.968836C8.15101 1.16385 8.45731 1.44416 8.68337 1.78511L9.36308 2.7798L9.37102 2.79164C9.44651 2.90627 9.54914 3.00048 9.66981 3.0659C9.78995 3.13104 9.92426 3.16563 10.0609 3.16663H16.6667C17.3297 3.16663 17.9656 3.43002 18.4345 3.89886C18.9033 4.3677 19.1667 5.00358 19.1667 5.66663V14C19.1667 14.663 18.9033 15.2989 18.4345 15.7677C17.9656 16.2366 17.3297 16.5 16.6667 16.5H3.33337C1.95647 16.5 0.833374 15.3769 0.833374 14V3.16663C0.833374 2.50358 1.09677 1.8677 1.56561 1.39886ZM3.33337 2.33329C3.11236 2.33329 2.9004 2.42109 2.74412 2.57737C2.58784 2.73365 2.50004 2.94561 2.50004 3.16663V14C2.50004 14.4564 2.87694 14.8333 3.33337 14.8333H16.6667C16.8877 14.8333 17.0997 14.7455 17.256 14.5892C17.4122 14.4329 17.5 14.221 17.5 14V5.66663C17.5 5.44561 17.4122 5.23365 17.256 5.07737C17.0997 4.92109 16.8877 4.83329 16.6667 4.83329H10.0541C9.64229 4.83116 9.23743 4.72734 8.87543 4.53108C8.51574 4.33607 8.20944 4.05576 7.98338 3.71481L7.30367 2.72012L7.29573 2.70828C7.22024 2.59365 7.1176 2.49943 6.99694 2.43401C6.8768 2.36888 6.74249 2.33429 6.60585 2.33329H3.33337Z"
      fill={color}
    />
  );
}