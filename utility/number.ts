export const number = (num = 0, short = false, defaultMax = 9999) => {
  if (num !== 0 && !num) return '-';

  const val = Math.sign(num) * Math.abs(num);

  if (short) {
    if (num > 9999 && num <= 999999 && defaultMax <= 9999) {
      return `${(val / 1000).toFixed(1)}rb`;
    }
    if (num > 999999 && num > defaultMax) {
      return `${(val / 1000000).toFixed(2)}jt`;
    }
  }

  return new Intl.NumberFormat('id-ID').format(val);
};

export const currency = (num?: number | null) => {
  if (num !== 0 && !num) return '-';

  return `Rp${number(num)}`;
};

export const convertToRupiah = (num: number) => {
  var rupiah = '';
  var angkarev = num.toString().split('').reverse().join('');
  for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
  return rupiah
    .split('', rupiah.length - 1)
    .reverse()
    .join('');
};
