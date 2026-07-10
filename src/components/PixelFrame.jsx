// Prosta pixelowa ramka gry (fallback CSS zamiast @react-pixel-ui).
export default function PixelFrame({ children, className = "", ...rest }) {
  return (
    <div className={`pixel-frame ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
