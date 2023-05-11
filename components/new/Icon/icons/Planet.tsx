export default function Planet(color: string) {
  return (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.99801 3.93651C9.20347 3.33708 10.5624 3 12 3C15.1204 3 17.8699 4.58803 19.4845 7H18C17.2043 7 16.4413 7.31607 15.8787 7.87868C15.3161 8.44129 15 9.20435 15 10C15 10.2652 14.8946 10.5196 14.7071 10.7071C14.5196 10.8946 14.2652 11 14 11C13.7348 11 13.4804 10.8946 13.2929 10.7071C13.1054 10.5196 13 10.2652 13 10C13 9.20435 12.6839 8.44129 12.1213 7.87868C11.5587 7.31607 10.7957 7 10 7C9.98111 7 9.96223 7.00054 9.94337 7.0016C9.51054 7.02615 9.08145 6.90939 8.72072 6.66891C8.40284 6.45699 8.15323 6.1591 8 5.81144V4C8 3.97867 7.99933 3.9575 7.99801 3.93651ZM6 5.29168C4.63358 6.51466 3.64303 8.14898 3.22302 10H5C5.79565 10 6.55871 10.3161 7.12132 10.8787C7.68393 11.4413 8 12.2044 8 13V14C8 14.2652 8.10536 14.5196 8.29289 14.7071C8.48043 14.8946 8.73478 15 9 15C9.79565 15 10.5587 15.3161 11.1213 15.8787C11.6839 16.4413 12 17.2043 12 18V21C12.6874 21 13.3568 20.9229 14 20.777V17C14 16.2043 14.3161 15.4413 14.8787 14.8787C15.4413 14.3161 16.2043 14 17 14H20.777C20.9229 13.3568 21 12.6874 21 12C21 10.9481 20.8195 9.93834 20.4879 9H18C17.7348 9 17.4804 9.10536 17.2929 9.29289C17.1054 9.48043 17 9.73478 17 10C17 10.7957 16.6839 11.5587 16.1213 12.1213C15.5587 12.6839 14.7957 13 14 13C13.2043 13 12.4413 12.6839 11.8787 12.1213C11.3161 11.5587 11 10.7957 11 10C11 9.73478 10.8946 9.48043 10.7071 9.29289C10.5247 9.11044 10.2789 9.00577 10.0215 9.00023C9.16778 9.04114 8.32301 8.80747 7.61132 8.33301C6.88988 7.85205 6.34426 7.1497 6.05663 6.33173C6.01915 6.22515 6 6.11298 6 6V5.29168ZM20.0645 16H17C16.7348 16 16.4804 16.1054 16.2929 16.2929C16.1054 16.4804 16 16.7348 16 17V20.0645C17.7585 19.1906 19.1906 17.7585 20.0645 16ZM11.2298 22.9735C11.4843 22.9911 11.7411 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 17.5954 5.17781 22.2151 10.5842 22.9097C10.7108 22.9677 10.8516 23 11 23C11.0791 23 11.156 22.9908 11.2298 22.9735ZM10 20.777V18C10 17.7348 9.89464 17.4804 9.70711 17.2929C9.51957 17.1054 9.26522 17 9 17C8.20435 17 7.44129 16.6839 6.87868 16.1213C6.31607 15.5587 6 14.7956 6 14V13C6 12.7348 5.89464 12.4804 5.70711 12.2929C5.51957 12.1054 5.26522 12 5 12H3C3 16.2832 5.99202 19.8675 10 20.777Z"
      fill={color}
    />
  );
}
