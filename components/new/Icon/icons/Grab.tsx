export default function Grab(color: string) {
  return (
    <>
      <path
        d="M22 11L20.5 9L18 8.5L16.5 7.5L15 8L13.5 6.5H11.5L9.5 7.5H6.5L6 13H5.5L4.00004 12C3.1667 12 1.70004 12.9 2.50004 16.5C3.30004 20.1 6.50004 21.6667 8.00004 22H16C19.6 21.2 21.1667 18 21.5 16.5L22 11Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.87868 5.87868C10.4413 5.31607 11.2044 5 12 5C12.7956 5 13.5587 5.31607 14.1213 5.87868C14.2763 6.03362 14.4125 6.20377 14.5286 6.38561C14.9739 6.13501 15.48 6 16 6C16.7956 6 17.5587 6.31607 18.1213 6.87868C18.4938 7.2512 18.7583 7.71159 18.8944 8.21114C19.243 8.07295 19.6178 8 20 8C20.7957 8 21.5587 8.31607 22.1213 8.87868C22.6839 9.44129 23 10.2043 23 11V14C23 16.3869 22.0518 18.6761 20.364 20.364C18.6761 22.0518 16.3869 23 14 23H10C7.61305 23 5.32387 22.0518 3.63604 20.364C1.94821 18.6761 1 16.3869 1 14C1 13.2044 1.31607 12.4413 1.87868 11.8787C2.44129 11.3161 3.20435 11 4 11C4.34394 11 4.6818 11.0591 5 11.1716V9C5 8.20435 5.31607 7.44129 5.87868 6.87868C6.44129 6.31607 7.20435 6 8 6C8.52001 6 9.02609 6.13501 9.4714 6.38562C9.58749 6.20377 9.72374 6.03362 9.87868 5.87868ZM3 14C3 15.8565 3.7375 17.637 5.05025 18.9497C6.36301 20.2625 8.14348 21 10 21H14C15.8565 21 17.637 20.2625 18.9497 18.9497C20.2625 17.637 21 15.8565 21 14V11C21 10.7348 20.8946 10.4804 20.7071 10.2929C20.5196 10.1054 20.2652 10 20 10C19.7348 10 19.4804 10.1054 19.2929 10.2929C19.1054 10.4804 19 10.7348 19 11V11.5C19 12.0523 18.5523 12.5 18 12.5C17.4477 12.5 17 12.0523 17 11.5V11V9C17 8.73478 16.8946 8.48043 16.7071 8.29289C16.5196 8.10536 16.2652 8 16 8C15.7348 8 15.4804 8.10536 15.2929 8.29289C15.1054 8.48043 15 8.73478 15 9V10V10.4C15 10.9523 14.5523 11.4 14 11.4C13.4477 11.4 13 10.9523 13 10.4V10V9V8C13 7.73478 12.8946 7.48043 12.7071 7.29289C12.5196 7.10536 12.2652 7 12 7C11.7348 7 11.4804 7.10536 11.2929 7.29289C11.1054 7.48043 11 7.73478 11 8V9V9.9V10C11 10.5523 10.5523 11 10 11C9.44771 11 9 10.5523 9 10V9.9V9C9 8.73478 8.89464 8.48043 8.70711 8.29289C8.51957 8.10536 8.26522 8 8 8C7.73478 8 7.48043 8.10536 7.29289 8.29289C7.10536 8.48043 7 8.73478 7 9V14C7 14.5523 6.55228 15 6 15C5.44772 15 5 14.5523 5 14C5 13.7348 4.89464 13.4804 4.70711 13.2929C4.51957 13.1054 4.26522 13 4 13C3.73478 13 3.48043 13.1054 3.29289 13.2929C3.10536 13.4804 3 13.7348 3 14Z"
        fill={color}
      />
    </>
  );
}
