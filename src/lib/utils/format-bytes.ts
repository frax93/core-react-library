const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

const factor = 1024;

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (!+bytes || bytes < 0) {
    return '0 Bytes';
  }

  const dm = decimals < 0 ? 0 : decimals;

  const sizeIndex = Math.floor(Math.log(bytes) / Math.log(factor));

  const size = sizeIndex < 0 ? 0 : sizeIndex;

  return `${Number.parseFloat((bytes / Math.pow(factor, sizeIndex)).toFixed(dm))} ${
    sizes[size] || 'YB'
  }`;
};
