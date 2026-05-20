import { useTheme } from '../context/ThemeContext';

export default function LogoIcon({ size = 28, style = {}, className = "", alt = "Clipo Icon" }) {
  const { isDark } = useTheme();
  const src = isDark ? "/images/Clipo-white.png" : "/images/Clipo-black.png";

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

