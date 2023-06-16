type PercentCircleProps = {
  percent: number;
  size?: number;
  strokeWidth?: number;
};

const PercentCircle = ({ percent, size = 120, strokeWidth = 10 }: PercentCircleProps) => {
  const radius = size / 2; // radius of the circle
  const circumference = 2 * Math.PI * radius; // circumference of the circle
  const progress = ((100 - percent) / 100) * circumference; // calculate progress in terms of circumference
  const width = size + strokeWidth * 2;
  const center = width / 2;

  return (
    <svg
      className="circle-progress fill-purple-400"
      width={size}
      height={size}
      viewBox={`0 0 ${width} ${width}`}
    >
      <defs>
        <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#9333ea" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
      </defs>
      <circle
        className="stroke-purple-200 fill-none"
        cx="50%"
        cy="50%"
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className="fill-none"
        cx="50%"
        cy="50%"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={progress}
        strokeWidth={strokeWidth}
        transform={`rotate(-90 ${center} ${center})`}
        stroke="url(#linear)"
      />
      <text
        className="text-4xl font-bold fill-primary"
        x="50%"
        y="45%"
        dy=".3em"
        textAnchor="middle"
      >
        {percent}%
      </text>
      <text
        className="text-lg font-semibold fill-primary"
        x="50%"
        y="62%"
        dy=".3em"
        textAnchor="middle"
      >
        Liked
      </text>
    </svg>
  );
};

export default PercentCircle;
