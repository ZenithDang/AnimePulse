import { useParams } from 'react-router-dom';

export default function GenreDrillDownPage() {
  const { genre } = useParams();

  return (
    <div
      className="flex-1 w-full px-4 py-4 flex items-center justify-center"
      style={{ maxWidth: '1600px', margin: '0 auto', minHeight: '400px' }}
    >
      <div className="text-center">
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          {genre}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Genre drill-down coming soon
        </p>
      </div>
    </div>
  );
}
