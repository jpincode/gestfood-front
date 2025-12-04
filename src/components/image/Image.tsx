import { IMAGES_URL } from '../../services/env';

interface ImageProps {
  fileName: string;
  alt: string;
  className?: string;
};

const Image = ({ fileName, alt, className }: ImageProps) => {
  return (
    <div>
      <img src={`${IMAGES_URL}/${fileName}`} alt={alt} className={className}/>
    </div>
  );
};

export default Image;