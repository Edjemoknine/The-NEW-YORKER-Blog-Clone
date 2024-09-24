/* eslint-disable @typescript-eslint/no-explicit-any */
const BookMarkIcon = ({ size, ...props }: { size: number, [key: string]: any }, fill: string) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={props.size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill={fill}
        d="M6 19.5V5.616q0-.691.463-1.153T7.616 4H13v1H7.616q-.231 0-.424.192T7 5.616V17.95l5-2.15l5 2.15V11h1v8.5l-6-2.577zM7 5h6zm10 4V7h-2V6h2V4h1v2h2v1h-2v2z"
      />
    </svg>
  );
};

export default BookMarkIcon;
