// Hàm tạo số ngẫu nhiên trong khoảng từ min đến max (bao gồm cả min và max)
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Hàm tạo một mã 64-bit WEP key không trùng lặp
export const generateUniqueWEPKey = () => {
  const keyBytes = [];

  // Tạo 5 byte đầu tiên ngẫu nhiên
  for (let i = 0; i < 5; i++) {
    keyBytes.push(getRandomInt(0, 255));
  }

  // Tính toán checksum để tổng số bit là số chẵn
  let checksum = 0;
  for (const byte of keyBytes) {
    checksum ^= byte;
  }

  // Bổ sung checksum vào byte cuối cùng
  keyBytes.push(checksum);

  // Chuyển đổi thành chuỗi hex
  const hexKey = keyBytes
    .map((byte) => byte.toString(16).toUpperCase())
    .join('');

  const code = `YC${hexKey}`;
  return code;
};
