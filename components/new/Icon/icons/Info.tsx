export default function Info(color: string) {
  return (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.01 17C11.4577 17 11.01 16.5523 11.01 16L11.01 12C11.01 11.4477 11.4577 11 12.01 11C12.5623 11 13.01 11.4477 13.01 12L13.01 16C13.01 16.5523 12.5623 17 12.01 17Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.01 8C13.01 8.55228 12.5623 9 12.01 9L12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7L12.01 7C12.5623 7 13.01 7.44772 13.01 8Z"
        fill={color}
      />
    </>
  );
}
