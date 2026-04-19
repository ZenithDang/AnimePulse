export default function DiscoverPage() {
  return (
    <div
      className="flex-1 w-full px-4 py-4 flex items-center justify-center"
      style={{ maxWidth: '1600px', margin: '0 auto', minHeight: '400px' }}
    >
      <div className="text-center">
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Hidden Gem Finder
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Coming soon — surfaces titles with high scores but low popularity
        </p>
      </div>
    </div>
  );
}
