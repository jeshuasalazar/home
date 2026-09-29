// <picture> con AVIF/WebP y dirección de arte para móvil.
// Las variantes viven en public/img/<name>-{1280,2400,movil}.{avif,webp}.

interface PictureProps {
  name: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  mobile?: boolean;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
}

export default function Picture({
  name,
  alt,
  className,
  imgClassName,
  mobile = false,
  priority = false,
  sizes = "100vw",
  width = 2016,
  height = 864,
}: PictureProps) {
  const set = (ext: string) => `/img/${name}-1280.${ext} 1280w, /img/${name}-2400.${ext} 2016w`;
  return (
    <picture className={className}>
      {mobile && <source media="(max-width: 40rem)" type="image/avif" srcSet={`/img/${name}-movil.avif`} />}
      {mobile && <source media="(max-width: 40rem)" type="image/webp" srcSet={`/img/${name}-movil.webp`} />}
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <img
        src={`/img/${name}-1280.webp`}
        srcSet={set("webp")}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={imgClassName}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
