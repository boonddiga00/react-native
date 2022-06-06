export interface IDay {
  temp: {
    day: number;
  };
  weather: Array<{ main: string }>;
}
