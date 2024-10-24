interface TooltipProps {
  label: string;
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  label,
  content,
  children,
}) => (
  <div className="group relative">
    {children}
    <div className="hidden group-hover:block absolute bottom-full left-0 w-48 p-2 bg-gray-800 text-white text-xs rounded mb-2 z-50">
      <div className="font-semibold mb-1">{label}</div>
      {content}
    </div>
  </div>
);
