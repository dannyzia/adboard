# AdBoard Configuration Reference

This document contains the complete list of categories, countries, states, and cities supported by the AdBoard platform.

## Categories

The platform supports the following 35 categories:

1. **Electronics** (blue)
2. **Cars & Trucks** (indigo)
3. **Motorcycles** (indigo)
4. **Boats & Marine** (indigo)
5. **RVs & Campers** (indigo)
6. **Houses for Sale** (orange)
7. **Apartments for Rent** (orange)
8. **Commercial Property** (orange)
9. **Vacation Rentals** (orange)
10. **Jobs** (cyan)
11. **Services** (purple)
12. **Fashion** (pink)
13. **Home & Garden** (green)
14. **Sports** (red)
15. **Books** (yellow)
16. **Pets** (amber)
17. **Food & Dining** (lime)
18. **Travel & Resorts** (sky)
19. **Deals & Offers** (emerald)
20. **Tickets** (violet)
21. **Events & Shows** (rose)
22. **Auction** (fuchsia)
23. **Buy & Sell** (slate)
24. **Notices** (teal)
25. **Health & Beauty** (pink)
26. **Baby & Kids** (rose)
27. **Arts & Crafts** (purple)
28. **Musical Instruments** (violet)
29. **Office Supplies** (slate)
30. **Digital Products** (cyan)
31. **Software & Apps** (blue)
32. **Tutoring & Lessons** (emerald)
33. **Home Repair** (amber)
34. **Free** (green)
35. **Other** (gray)

## Geographic Coverage

### United States

#### California
- Los Angeles
- San Francisco
- San Diego
- San Jose
- Sacramento

#### Texas
- Houston
- Dallas
- Austin
- San Antonio
- Fort Worth

#### New York
- New York City
- Buffalo
- Rochester
- Albany
- Syracuse

#### Florida
- Miami
- Orlando
- Tampa
- Jacksonville
- Fort Lauderdale

#### Illinois
- Chicago
- Aurora
- Naperville
- Joliet
- Rockford

### Canada

#### Ontario
- Toronto
- Ottawa
- Mississauga
- Hamilton
- London

#### Quebec
- Montreal
- Quebec City
- Laval
- Gatineau
- Longueuil

#### British Columbia
- Vancouver
- Victoria
- Surrey
- Burnaby
- Richmond

#### Alberta
- Calgary
- Edmonton
- Red Deer
- Lethbridge
- Medicine Hat

### United Kingdom

#### England
- London
- Manchester
- Birmingham
- Liverpool
- Leeds

#### Scotland
- Edinburgh
- Glasgow
- Aberdeen
- Dundee
- Inverness

#### Wales
- Cardiff
- Swansea
- Newport
- Wrexham
- Barry

### Australia

#### New South Wales
- Sydney
- Newcastle
- Wollongong
- Central Coast
- Maitland

#### Victoria
- Melbourne
- Geelong
- Ballarat
- Bendigo
- Shepparton

#### Queensland
- Brisbane
- Gold Coast
- Sunshine Coast
- Townsville
- Cairns

## Summary Statistics

- **Total Categories**: 35
- **Total Countries**: 4
- **Total States/Provinces**: 17
- **Total Cities**: 85

## Notes

- This configuration is used by the seed script to generate sample ads
- Each category has associated sample images from Unsplash
- The geographic coverage can be expanded by modifying the `LOCATIONS` constant in `backend/scripts/seedAds.js`
- Categories are defined in `backend/config/categories.config.js`