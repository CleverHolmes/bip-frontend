type Props = {
  children: React.ReactNode;
};

const MessageSeparator: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-row items-center justify-between p-2 text-xs font-custom2 text-horizontalDividerText">
      <hr
        style={{
          width: '30%',
          border: 'none',
          backgroundImage:
            '-webkit-linear-gradient(left, transparent 0%, rgba(124, 139, 158, 20) 100%)',
          height: '0.6px',
        }}
      />
      {children}
      <hr
        style={{
          width: '30%',
          border: 'none',
          backgroundImage:
            '-webkit-linear-gradient(left, rgba(124, 139, 158, 20) 0%, transparent 100%)',
          height: '0.6px',
        }}
      />
    </div>
  );
};

export default MessageSeparator;
