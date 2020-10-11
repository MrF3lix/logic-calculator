const dec2bin = dec => {
    return (dec >>> 0).toString(2);
};

export const getBinaryArrayFromDecimal = (dec, length) => {
    let rowBin = dec2bin(dec).split('');

    rowBin = rowBin.map(i => parseInt(i));

    while (rowBin.length < length) {
        rowBin.unshift(0);
    }

    return rowBin;
};