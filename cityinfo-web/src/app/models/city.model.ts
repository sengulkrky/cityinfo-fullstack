import { PointOfInterest } from './point-of-interest.model';

export interface CityWithoutPointsOfInterest {
  id: number;
  name: string;
  description: string | null;
}

export interface City extends CityWithoutPointsOfInterest {
  numberOfPointsOfInterest: number;
  pointsOfInterest: PointOfInterest[];
}
