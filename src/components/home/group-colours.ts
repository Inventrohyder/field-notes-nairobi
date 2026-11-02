import type { GroupId } from '../../ideas/types';

/** One colour per group, shared by the hero picture and the group headings. */
export const GROUP_COLOURS: Record<GroupId, string> = {
  ride: '#3fb67f',
  reports: '#f2b705',
  map: '#e8823a',
  collect: '#4e9bf2',
  quick: '#a77ee6',
  growing: '#ef6a6e',
};

/** Short group names for the hero picture. */
export const GROUP_SHORT: Record<GroupId, string> = {
  ride: 'Ride & route',
  reports: 'Reports',
  map: 'On the map',
  collect: 'At scale',
  quick: 'Quick asks',
  growing: 'Growing',
};
