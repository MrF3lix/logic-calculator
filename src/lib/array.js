const unique = (value, index, self) => self.indexOf(value) === index;


export const distinctItems = arr => {
    const singleDimensionArray = arr.map(i => i.join());
    const distinctSingleDimensionArray = singleDimensionArray.filter(unique);
    return distinctSingleDimensionArray.map(item => {
        let elements = item.split(',');

        return elements.map(el => {
            if (el == 0 || el == 1) {
                return parseInt(el);
            } else {
                return el;
            }
        });
    });
};