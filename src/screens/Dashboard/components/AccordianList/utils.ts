import type { Vehicle, VehicleGroup, VehicleStatus } from './types';

export const computeSummary = (vehicles: Vehicle[]) => {
  const base: Record<VehicleStatus, number> = {
    on: 0,
    idle: 0,
    off: 0,
    longoff: 0,
    no_signal: 0,
  };

  vehicles.forEach((v) => {
    base[v.status] = (base[v.status] || 0) + 1;
  });

  return base;
};

export const groupVehicles = (vehicles: Vehicle[]): VehicleGroup[] => {
  
  
  const map = new Map<string, Vehicle[]>();

  vehicles.forEach((v) => {
    if (!map.has(v.group)) {
      map.set(v.group, []);
    }
    map.get(v.group)!.push(v);
  });

  return Array.from(map.entries()).map(([name, vs]) => ({
    name,
    summary: computeSummary(vs),
    vehicles: vs,
  }));
};


export function formatStatusTime(statusTime: string,from:string): string {
  const now = new Date();
  const time = new Date(statusTime);
  const diffMs = now.getTime() - time.getTime(); // difference in milliseconds

  if (diffMs < 0) return "in the future"; // in case of future timestamp

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

  return "long time ago";
}


export default function timeAgo(timestamp: string | Date): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "just now";

  const hours = Math.floor(minutes / 60);
  if (hours < 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 1) return `${days} day${days > 1 ? "s" : ""} ago`;

  const years = Math.floor(months / 12);
  if (years < 1) return `${months} month${months > 1 ? "s" : ""} ago`;

  return `${years} year${years > 1 ? "s" : ""} ago`;
}

