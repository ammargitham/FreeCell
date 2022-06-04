import formatSeconds from './formatSeconds';

describe('test formatSeconds', () => {
  test('should correctly format seconds', () => {
    let format = formatSeconds();
    expect(format).toBe('00:00');

    format = formatSeconds(10);
    expect(format).toBe('00:10');

    format = formatSeconds(100);
    expect(format).toBe('01:40');

    format = formatSeconds(500);
    expect(format).toBe('08:20');

    format = formatSeconds(3600);
    expect(format).toBe('1:00:00');

    format = formatSeconds(3630);
    expect(format).toBe('1:00:30');

    format = formatSeconds(3730);
    expect(format).toBe('1:02:10');

    format = formatSeconds(4540);
    expect(format).toBe('1:15:40');

    format = formatSeconds(7540);
    expect(format).toBe('2:05:40');

    format = formatSeconds(25440);
    expect(format).toBe('7:04:00');

    format = formatSeconds(36560);
    expect(format).toBe('10:09:20');

    format = formatSeconds(50560);
    expect(format).toBe('14:02:40');
  });
});
