export interface PointOfInterest {
  id: number;
  name: string;
  description: string | null;
}

export interface PointOfInterestRequest {
  name: string;
  description: string | null;
}
