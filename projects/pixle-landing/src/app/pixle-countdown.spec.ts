import { getPixleCountdown } from './pixle-countdown';

describe('getPixleCountdown', () => {
  it('counts down to the next local midnight', () => {
    const countdown = getPixleCountdown(new Date(2026, 10, 25, 21, 30, 15));
    expect(countdown).toEqual(
      expect.objectContaining({ hours: '02', minutes: '29', seconds: '45' }),
    );
  });

  it('starts a full day at midnight', () => {
    const countdown = getPixleCountdown(new Date(2026, 10, 25, 0, 0, 0));
    expect([countdown.hours, countdown.minutes, countdown.seconds]).toEqual(['24', '00', '00']);
    expect(countdown.progress).toBe(0);
  });

  it('reports how much of the day has passed', () => {
    expect(getPixleCountdown(new Date(2026, 10, 25, 12, 0, 0)).progress).toBeCloseTo(50);
  });

  it('rolls over the end of a month', () => {
    const countdown = getPixleCountdown(new Date(2026, 10, 30, 23, 59, 59));
    expect([countdown.hours, countdown.minutes, countdown.seconds]).toEqual(['00', '00', '01']);
  });
});
