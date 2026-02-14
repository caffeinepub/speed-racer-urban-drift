export const ASSETS = {
  backgrounds: {
    cityDay: '/assets/generated/bg-city-day.dim_1920x1080.png',
    neonNight: '/assets/generated/bg-neon-night.dim_1920x1080.png',
    highway: '/assets/generated/bg-highway.dim_1920x1080.png',
    tunnel: '/assets/generated/bg-tunnel.dim_1920x1080.png'
  },
  cars: {
    sports: '/assets/generated/car-sports.dim_512x512.png',
    muscle: '/assets/generated/car-muscle.dim_512x512.png',
    drift: '/assets/generated/car-drift.dim_512x512.png',
    super: '/assets/generated/car-super.dim_512x512.png'
  },
  icons: {
    coin: '/assets/generated/icon-coin.dim_128x128.png',
    nitro: '/assets/generated/icon-nitro.dim_128x128.png',
    shield: '/assets/generated/icon-shield.dim_128x128.png',
    magnet: '/assets/generated/icon-magnet.dim_128x128.png'
  },
  obstacles: {
    cone: '/assets/generated/obstacle-cone.dim_256x256.png',
    barrier: '/assets/generated/obstacle-barrier.dim_256x256.png',
    pothole: '/assets/generated/obstacle-pothole.dim_256x256.png'
  }
};

export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function preloadAllAssets(): Promise<Map<string, HTMLImageElement>> {
  const imageMap = new Map<string, HTMLImageElement>();
  const allAssets = [
    ...Object.values(ASSETS.backgrounds),
    ...Object.values(ASSETS.cars),
    ...Object.values(ASSETS.icons),
    ...Object.values(ASSETS.obstacles)
  ];

  await Promise.all(
    allAssets.map(async (src) => {
      try {
        const img = await preloadImage(src);
        imageMap.set(src, img);
      } catch (e) {
        console.warn(`Failed to load asset: ${src}`);
      }
    })
  );

  return imageMap;
}
