'use client';

interface GameRendererProps {
  html: string;
}

export default function GameRenderer({ html }: GameRendererProps) {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  return (
    <div className="w-full h-full relative">
      <iframe
        src={url}
        className="w-full h-full border-0 rounded-lg"
        sandbox="allow-scripts allow-same-origin"
        title="Your Game"
        onLoad={() => URL.revokeObjectURL(url)}
      />
    </div>
  );
}
