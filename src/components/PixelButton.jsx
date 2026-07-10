// Pixelowy, brutalistyczny przycisk (fallback CSS zamiast @react-pixel-ui).
export default function PixelButton({
  children,
  active = false,
  disabled = false,
  className = "",
  ...rest
}) {
  const classes = ["pixel-button", active ? "is-active" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
