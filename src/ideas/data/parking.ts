import type { Idea } from '../types';

export const idea: Idea = {
  id: 'parking',
  num: '15',
  group: 'map',
  title: 'Parking prices',
  short: 'Parking prices',
  hook: 'Show what parking costs, starting with Nairobi’s car parks.',
  teams: ['WME & Geo Collaboration', 'Partners & Feeds'],
  problem:
    'In Kenya, Waze shows a car park but not what it costs. In Nairobi the county street fee is simple and public.',
  moment: {
    text: 'Nairobi street parking costs KSh 300 a day for a saloon car, paid by dialling *647#.<sup class="fn"><a href="#src-parking-1" aria-label="Source 1">1</a></sup>',
  },
  known:
    'Waze shows what parking garages cost, in the US and Canada.<sup class="fn"><a href="#src-parking-2" aria-label="Source 2">2</a></sup>',
  today:
    'Car parks record cost only as a bucket, and street parking is not on the map.<sup class="fn"><a href="#src-parking-3" aria-label="Source 3">3</a>,<a href="#src-parking-4" aria-label="Source 4">4</a></sup>',
  proposed:
    'Car parks get a real price, shown when you arrive; street parking would need a new map item.',
  howToday:
    'Car parks in the editor record cost only as a bucket: Free, Low, Moderate or Expensive. There is no price field.<sup class="fn"><a href="#src-parking-3" aria-label="Source 3">3</a></sup> Kenya’s editing guide says on-street parking “should not be added at this time”.<sup class="fn"><a href="#src-parking-4" aria-label="Source 4">4</a></sup> Garage prices in the app cover the US and Canada.<sup class="fn"><a href="#src-parking-2" aria-label="Source 2">2</a></sup>',
  howProposed:
    'A price field, with amount, currency and per hour or per day, for car parks, shown at the destination and kept current by editors. Street parking would need a new map item, such as a priced street zone carrying the county fee, because Kenya’s guide keeps on-street parking off the map.',
  elsewhere: [
    {
      text: 'Waze itself shows prices for more than 30,000 garages in the US and Canada (2024).<sup class="fn"><a href="#src-parking-2" aria-label="Source 2">2</a></sup>',
    },
    {
      text: 'Apple Maps added Parkopedia prices and hours for garages and lots in 2016.<sup class="fn"><a href="#src-parking-7" aria-label="Source 7">7</a></sup>',
    },
  ],
  why: [
    'The county street fee is easy to seed and stable: KSh 300 a day, and in July 2026 the county denied a rise to KSh 535.<sup class="fn"><a href="#src-parking-1" aria-label="Source 1">1</a>,<a href="#src-parking-5" aria-label="Source 5">5</a></sup>',
    'A 2016 ITDP survey counted 5,098 street spaces in Nairobi’s CBD at 91–93% peak occupancy.<sup class="fn"><a href="#src-parking-6" aria-label="Source 6">6</a></sup>',
  ],
  knownShort: 'Waze shows parking garage prices in the US and Canada.',
  askShort:
    'Add a price field to parking places in the editor, starting with Nairobi’s off-street car parks.',
  ask: 'Add a price field to parking places in the editor and let Kenyan editors fill it, starting with Nairobi’s off-street car parks. Street parking would need a new map item, such as a priced zone with the county fee.',
  sources: [
    {
      n: 1,
      label: 'Kenyans.co.ke: Nairobi County denies parking fee hike (20 Jul 2026)',
      url: 'https://www.kenyans.co.ke/news/125435-nairobi-county-denies-reports-parking-fee-hike',
    },
    {
      n: 2,
      label: 'Google Canada blog: 6 updates to Waze (5 Mar 2024)',
      url: 'https://blog.google/intl/en-ca/products/android-chrome-more/6-updates-to-waze',
    },
    {
      n: 3,
      label: 'WME SDK: ParkingLotCostType',
      url: 'https://www.waze.com/editor/sdk/types/index.SDK.ParkingLotCostType.html',
    },
    {
      n: 4,
      label: 'Wazeopedia, East African Community: Parking lots (Mar 2025)',
      url: 'https://www.waze.com/discuss/t/parking-lots/379778',
    },
    {
      n: 5,
      label:
        'Capital FM: Nairobi proposes higher parking fees under new pricing policy (20 Jul 2026)',
      url: 'https://capitalfm.africa/nairobi-proposes-higher-parking-fees-under-new-pricing-policy/',
    },
    {
      n: 6,
      label: 'ITDP: Nairobi CBD Parking Survey (2016, PDF)',
      url: 'https://africa.itdp.org/wp-content/uploads/2021/04/Nairobi-CBD-Parking-Survey-160613.pdf',
    },
    {
      n: 7,
      label: 'AppleInsider: Apple Maps adds Parkopedia data (27 Jul 2016)',
      url: 'https://appleinsider.com/articles/16/07/27/apple-maps-adds-parkopedia-data-on-garages-and-parking-lots',
    },
  ],
};
