

const units = {
    millisecond: {
        value: 1,
        unit: '毫秒'
    },
    second: {
        value: 1e3,
        unit: '秒'
    },
    minute: {
        value: 6e4,
        unit: '分钟'
    },
    hour: {
        value: 3.6e6,
        unit: '小时'
    },
    day: {
        value: 8.64e7,
        unit: '天'
    },
    month: {
        value: 2.592e9,
        unit: '月'
    },
    year: {
        value: 3.15576e10,
        unit: '年'
    },
};

const orderUnits = [units.year, units.month, units.day, units.hour, units.minute, units.second, units.millisecond];


export function timeu(input: number) {
    let res = '';
    orderUnits.reduce((previousValue, currentValue) => {
        const less = previousValue;
        if (less >= currentValue.value) {
            const integer = (less / currentValue.value) | 0;
            const residue = less % currentValue.value;
            res += ` ${integer} ${currentValue.unit}`;
            return residue;
        }
        return less;
    }, input);

    return res;
}