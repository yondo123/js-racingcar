import { NAME_CONFIGURE, ERROR_MESSAGE } from '../src/constants/index';
import { DUMMY_CORRECT_CARS, DUMMY_INCORRECT_LENGTH_CARS_NAMES, DUMMY_NOT_STRING_CAR_NAMES } from './constants';
import validate from '../src/utils/validate';
import Car from '../src/Car';

describe('자동차 이름 충족 조건 테스트', () => {
  test.each(DUMMY_CORRECT_CARS)('자동차는 이름($name)을 가질 수 있다.', ({ name }) => {
    const car = new Car(name);
    expect(car.name).toBe(name);
  });

  test.each(DUMMY_INCORRECT_LENGTH_CARS_NAMES)(
    `자동차 이름($name)은 최소 ${NAME_CONFIGURE.MIN_LENGTH}글자 이상 최대${NAME_CONFIGURE.MAX_LENGTH} 글자 까지 허용한다.`,
    ({ name }) => {
      expect(() => validate(name)).toThrow(ERROR_MESSAGE.CAR_NAME_INCORRECT_LENGTH);
    }
  );

  test.each(DUMMY_NOT_STRING_CAR_NAMES)(`자동차 이름($name)은 문자열 타입만 허용됩니다. `, ({ name }) => {
    expect(() => validate(name)).toThrow(ERROR_MESSAGE.CAR_NAME_NOT_STRING);
  });
});
