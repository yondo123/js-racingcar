import {
  DUMMY_CORRECT_CARS,
  DUMMY_INPUT_CAR_NAMES,
  DUMMY_INCORRECT_INPUT_CAR_NAMES,
  DUMMY_RACE_SET,
  DUMMY_DUPLICATE_RACE_SET
} from './constants';
import { ERROR_MESSAGE, RACE_CONFIGURE, ALERT_MESSAGE } from '../src/constants/index';
import { Car, CarPrompter, CarRace } from '../src/classes/index';

const { MOVE_CONDITION, MAX_LAP } = RACE_CONFIGURE;

describe('자동차 경주 테스트', () => {
  beforeEach(() => {
    logSpy = jest.spyOn(global.console, 'log');
  });

  afterEach(() => {
    logSpy.mockClear();
  });

  test.each(DUMMY_INPUT_CAR_NAMES)(
    '자동차 경주에 참여하는 자동차 이름은 쉼표(,)로 구분하여 입력한다.($input)',
    ({ input }) => {
      expect(() => {
        CarPrompter.validate(input);
      }).not.toThrow();
    }
  );

  test.each(DUMMY_INCORRECT_INPUT_CAR_NAMES)('경주에 참여하는 자동차는 중복이될 수 없다.', ({ input }) => {
    expect(() => {
      CarPrompter.validate(input);
    }).toThrow(ERROR_MESSAGE.DUPLICATE_CAR);
  });

  it(`자동차 경주는 총 ${MAX_LAP}회로 이루어진다.`, () => {
    const carRace = new CarRace();
    for (let lap = 0; lap < MAX_LAP; lap += 1) {
      expect(carRace.getLap()).toBe(lap);
      carRace.nextLap();
    }
    carRace.nextLap();
    expect(carRace.getLap()).toBe(MAX_LAP);
  });

  test.each(DUMMY_CORRECT_CARS)(
    `자동차 경주에서 거리 값이 ${MOVE_CONDITION} 이상일 때 전진한다. (자동차: $name, 거리:$movableDistance)`,
    ({ name, movableDistance }) => {
      const car = new Car(name);
      car.move(movableDistance >= MOVE_CONDITION);
      expect(car.moved).toBe(1);
    }
  );

  test.each(DUMMY_CORRECT_CARS)(
    `자동차 경주에서 거리 값이 ${MOVE_CONDITION} 미만이면 멈춘다. (자동차: $name, 거리:$movableDistance)`,
    ({ name, notMovableDistance }) => {
      const car = new Car(name);
      car.move(notMovableDistance >= MOVE_CONDITION);
      expect(car.moved).toBe(0);
    }
  );

  it('자동차 주행 횟수 마다 경주 상태를 출력한다.', () => {
    const carRace = new CarRace(DUMMY_RACE_SET);
    carRace.race();
    carRace.print();
    expect(logSpy).toHaveBeenCalledTimes(DUMMY_RACE_SET.length);
  });

  it('자동차 경주 종료 후, 우승자를 출력한다.', () => {
    const carRace = new CarRace(DUMMY_RACE_SET);
    carRace.result();
    const winners = carRace.getWinners();
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy.mock.calls[0][0]).toBe(ALERT_MESSAGE.RACE_FINISH_MESSAGE(winners));
  });

  it('우승자는 여러 명일 수 있다. ', () => {
    const carRace = new CarRace(DUMMY_DUPLICATE_RACE_SET);
    carRace.result();
    const winners = carRace.getWinners();
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy.mock.calls[0][0]).toBe(ALERT_MESSAGE.RACE_FINISH_MESSAGE(winners));
  });
});