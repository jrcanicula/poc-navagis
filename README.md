# Discover Cebu's Restaurants

Discover Cebu's Restaurants is a web application that helps users explore, filter, and navigate to restaurants in Cebu. The application uses the Google Maps API to provide an interactive map experience with various features such as restaurant plotting, filtering by type, directions, visitor tracking, spatial analytics, and revenue analytics.

## Features

### Restaurant Plotting
- Plot restaurants across Cebu on a map using Google Maps.
- Each restaurant marker shows its name, type, specialties, and photo.

### Food Specialties
- Each restaurant displays at least one food specialty, randomly assigned from a predefined list.

### Filtering
- Implement a layer panel to filter restaurants by type.
- The filter updates the map to show only the selected types of restaurants.

### Directions
- Enable customers to get directions to restaurants from their current location.
- Uses Google Maps Directions API for route calculation.

### Visitor Tracking
- Allow each restaurant to track the number of customers who visited.
- Visit counts are stored in the browser's localStorage.

### Spatial Analytics
- Draw a circle or rectangle on the map and display the number of restaurants within it.
- Uses Google Maps Drawing Manager for drawing shapes.

### Analytics
- Implement analytics to show relationships between patrons, restaurants, and revenue.
- Display analytics in a graphical format using a visualization library.

## Assumptions

- The user location is assumed to be at the center of Cebu City.
- Restaurants data is fetched from the Google Places API.

## Getting Started

### Prerequisites
- Node.js and npm installed
- Google Maps API key

### Installation

1. Clone the repository:
   git clone https://github.com/jrcanicula/poc-navagis
   cd poc-navagis



### Known Issues in Development but not during deployment

There is a known bug with the library used for drawing the **Spatial Analytics** when drawing a circle or rectangle on the map and display the number of restaurants within it.
