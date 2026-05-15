export default function LogoIcon({ size = 28, style = {}, className = "", src = "/images/clipo-bg.png", alt = "Clipo Icon" }) {
  return (
    <img 
      src={src}
      alt={alt}
      style={{ 
        width: size, 
        height: size, 
        objectFit: 'contain', 
        display: 'inline-block',
        ...style 
      }} 
      className={className}
    />
  );
}
