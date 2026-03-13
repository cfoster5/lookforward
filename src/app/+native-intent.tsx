function normalizePath(path: string) {
  try {
    // Handle both universal links and custom scheme links.
    const url = new URL(path, "lookforward://app");
    return url.pathname.replace(/^\/+/, "");
  } catch {
    return path.replace(/^\/+/, "");
  }
}

function remapSharedItemPath(path: string) {
  const normalizedPath = normalizePath(path);

  const movieMatch = normalizedPath.match(/^movie\/([^/?#]+)/);
  if (movieMatch) {
    return `/(tabs)/(find)/movie/${movieMatch[1]}`;
  }

  const personMatch = normalizedPath.match(/^person\/([^/?#]+)/);
  if (personMatch) {
    return `/(tabs)/(find)/person/${personMatch[1]}`;
  }

  const gameMatch = normalizedPath.match(/^game\/([^/?#]+)/);
  if (gameMatch) {
    return `/(tabs)/(find)/game/${gameMatch[1]}`;
  }

  const collectionMatch = normalizedPath.match(/^movie-collection\/([^/?#]+)/);
  if (collectionMatch) {
    return `/(tabs)/(find)/movie-collection/${collectionMatch[1]}`;
  }

  return path;
}

export function redirectSystemPath({ path }: { path: string }) {
  return remapSharedItemPath(path);
}
