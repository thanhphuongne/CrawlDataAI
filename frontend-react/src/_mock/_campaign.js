export const MONTHS = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1, // Giá trị từ 1 đến 12
  label: `Tháng ${index + 1}` // Nhãn là "Tháng 1", "Tháng 2", ..., "Tháng 12"
}));

export const Quarter = [
  { value: '1', label: 'Quý 1' },
  { value: '2', label: 'Quý 2' },
  { value: '3', label: 'Quý 3' },
  { value: '4', label: 'Quý 4' },
];

export const CATEGORY_OPTIONS = [
  "Defi",
  "Lifestyle",
  "NFT",
  "Media",
  "B2B",
  "Exchanges",
  "Finance",
  "Metaverse",
  "Games",
  "Music",
  "Social Media",
  "Software",
  "Education",
];


