/* global google */
import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer, DrawingManager } from '@react-google-maps/api';
import AnalyticsDashboard from './AnalyticsDashboard';
import Filter from './Filter';


const CENTER_OF_CEBU_LONGTITUDE = 123.8854;
const CENTER_OF_CEBU_LATITUDE = 10.3157;
const RESTAURANTS_LENGTH = 200;
const MAP_HEIGHT = '700px';
const MAP_WIDTH = '100%';
const GOOGLE_KEYS = 'AIzaSyAl45zXaQCDh7hOZtgb_Pdyman_ioVTgnU';

const Map = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [directions, setDirections] = useState(null);
  const [drawnShape, setDrawnShape] = useState(null);
  const [shapeRestaurants, setShapeRestaurants] = useState([]);
  const [libraries] = useState(['geometry', 'drawing', 'places']);
  const [isMapLoadedProperlyCount, setIsMapLoadedProperlyCount] = useState(0);
  const [showDrawingManager, setShowDrawingManager] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null); // State to hold analytics data
  const mapRef = useRef(null);
  const [showDashboard, setShowDashboard] = useState(false); // State to toggle dashboard visibility

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  const onLoad = (map) => {
    mapRef.current = map;
    setIsMapLoadedProperlyCount(isMapLoadedProperlyCount + 1);
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  const possibleSpecialties = [
    'Seafood',
    'Grilled',
    'Vegetarian',
    'Desserts',
    'Italian',
    'Japanese',
    'Mexican',
    'Filipino',
    'Chinese',
    'Barbecue',
    'Steakhouse',
    'Vegan',
    'Thai',
    'French',
    'Korean'
  ];

  const getRandomSpecialty = () => {
    return possibleSpecialties[Math.floor(Math.random() * possibleSpecialties.length)];
  };

  useEffect(() => {
    const loadUserLocationAndPlaces = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLatLng = new google.maps.LatLng(CENTER_OF_CEBU_LATITUDE, CENTER_OF_CEBU_LONGTITUDE);
        setUserLocation({ lat: CENTER_OF_CEBU_LATITUDE, lng: CENTER_OF_CEBU_LONGTITUDE });

        const map = mapRef.current;

        const service = new google.maps.places.PlacesService(map);

        const request = {
          location: userLatLng,
          radius: '100000',
          type: ['restaurant']
        };

        let allRestaurants = [];

        const fetchNextPage = (pagination) => {
          if (pagination.hasNextPage) {
            pagination.nextPage();
          } else {
            setRestaurants(allRestaurants);
            setFilteredRestaurants(allRestaurants);
          }
        };

        const fetchRestaurantDetails = (placeId) => {
          return new Promise((resolve, reject) => {
            service.getDetails({ placeId }, (place, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                //console.log(place);
                resolve({
                  id: place.place_id,
                  name: place.name,
                  location: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
                  type: place.types.join(', ')?.toUpperCase(),
                  specialties: [getRandomSpecialty()],
                  photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 }) || null,
                  visits: JSON.parse(localStorage.getItem(`visits-${place.place_id}`)) || 0,
                });
              } else {
                reject(new Error(`Error fetching place details for ${placeId}: ${status}`));
              }
            });
          });
        };

        const callback = (results, status, pagination) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const promises = results.map((place) => {
              return fetchRestaurantDetails(place.place_id)
                .catch((error) => {
                  console.error(`Error fetching details for place ${place.place_id}: ${error}`);
                  return null;
                });
            });

            Promise.all(promises)
              .then((fetchedRestaurants) => {
                allRestaurants = allRestaurants.concat(fetchedRestaurants.filter(Boolean));

                if (allRestaurants.length < RESTAURANTS_LENGTH && pagination.hasNextPage) {
                  fetchNextPage(pagination);
                } else {
                  setRestaurants(allRestaurants.slice(0, RESTAURANTS_LENGTH));
                  setFilteredRestaurants(allRestaurants.slice(0, RESTAURANTS_LENGTH));
                }
              })
              .catch((error) => {
                console.error('Error fetching restaurant details:', error);
              });
          }
        };

        service.nearbySearch(request, callback);
      });
    };

    if (window.google && window.google.maps) {
      loadUserLocationAndPlaces();
    }
  }, [window.google]);

  useEffect(() => {
    if (selectedType) {
      setFilteredRestaurants(
        restaurants.filter((restaurant) => restaurant.type.includes(selectedType))
      );
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [selectedType, restaurants]);

  useEffect(() => {
    if (selectedType) {
      setFilteredRestaurants(
        restaurants.filter((restaurant) => restaurant.type.includes(selectedType))
      );
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [selectedType, restaurants]);




  useEffect(() => {
    if (drawnShape) {
      const shapeBounds = drawnShape.getBounds ? drawnShape.getBounds() : drawnShape.getPath();
      const withinShape = filteredRestaurants.filter((restaurant) => {
        const { lat, lng } = restaurant.location;
        if (drawnShape.type === 'circle') {
          const center = drawnShape.getCenter();
          const radius = drawnShape.getRadius();
          const distance = google.maps.geometry.spherical.computeDistanceBetween(center, new google.maps.LatLng(lat, lng));
          return distance <= radius;
        } else if (drawnShape.type === 'rectangle') {
          return shapeBounds.contains(new google.maps.LatLng(lat, lng));
        }
        return false;
      });
      setShapeRestaurants(withinShape);
    } else {
      setShapeRestaurants([]);
    }
  }, [drawnShape, filteredRestaurants]);

  useEffect(() => {
    // Simulated data aggregation for analytics
    const aggregateAnalyticsData = () => {
      const visitsByRestaurant = restaurants.reduce((acc, restaurant) => {
        acc[restaurant.id] = JSON.parse(localStorage.getItem(`visits-${restaurant.id}`)) || 0;
        return acc;
      }, {});

      const revenueByRestaurant = restaurants.reduce((acc, restaurant) => {
        acc[restaurant.id] = Math.floor(Math.random() * 10000);
        return acc;
      }, {});

      const restaurantNames = restaurants.reduce((acc, restaurant) => {
        acc[restaurant.id] = restaurant.name;
        return acc;
      }, {});

      setAnalyticsData({
        visitsByRestaurant,
        revenueByRestaurant,
        restaurantNames
      });
    };

    aggregateAnalyticsData();
  }, [drawnShape, filteredRestaurants]);

  const handleMarkerClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setDirections(null);
  };

  const handleVisit = (restaurant) => {
    const visits = (JSON.parse(localStorage.getItem(`visits-${restaurant.id}`)) || 0) + 1;
    localStorage.setItem(`visits-${restaurant.id}`, JSON.stringify(visits));
    setSelectedRestaurant({
      ...restaurant,
      visits
    });
  };

  const getDirections = () => {
    if (!userLocation || !selectedRestaurant) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: 10.3157, lng: 123.8854 },
        destination: { lat: selectedRestaurant.location.lat, lng: selectedRestaurant.location.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  const onDrawingComplete = (shape) => {
    if (drawnShape) {
      drawnShape.setMap(null);
    }
    setDrawnShape(shape);
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_KEYS} libraries={libraries}>

      <div className="header">
        <h1>Discover Cebu's Restaurants</h1>
        <p>Find, filter, and navigate to your favorite spots</p>
      </div>

      <div className="map-container">
        <Filter
          types={[...new Set(restaurants.map((restaurant) => restaurant.type))]}
          selectedType={selectedType}
          onSelectType={setSelectedType}
        />


        <GoogleMap
          mapContainerStyle={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
          center={{ lat: CENTER_OF_CEBU_LATITUDE, lng: CENTER_OF_CEBU_LONGTITUDE }}
          zoom={15}
          ref={mapRef}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >

          {window.google && window.google.maps && showDrawingManager && <DrawingManager
            onLoad={() => console.log("Drawing Manager Loaded switch")}
            onOverlayComplete={(e) => {
              const shape = e.overlay;
              shape.type = e.type;
              onDrawingComplete(shape);
            }}
            options={{
              drawingControl: true,
              drawingControlOptions: {
                drawingModes: ['circle', 'rectangle'],
              },
              circleOptions: {
                fillColor: "#199ee0",
                fillOpacity: 0.2,
                strokeWeight: 2,
                strokeColor: "#113460",
                clickable: true,
                editable: true,
                geodesic: false,
                visible: true,
                zIndex: 1
              },
            }}
          />
          }

          {filteredRestaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={{ lat: restaurant.location.lat, lng: restaurant.location.lng }}
              onClick={() => handleMarkerClick(restaurant)}
            />
          ))}

          {selectedRestaurant && (
            <InfoWindow
              position={{ lat: selectedRestaurant.location.lat, lng: selectedRestaurant.location.lng }}
              onCloseClick={() => setSelectedRestaurant(null)}
            >
              <div className="info-window-container">
                <h2>{selectedRestaurant.name}</h2>
                {selectedRestaurant.photoUrl && (
                  <img src={selectedRestaurant.photoUrl} alt={selectedRestaurant.name} style={{ maxWidth: '100%' }} />
                )}
                <p>Establishment Type: {selectedRestaurant.type}</p>
                <p>Visits: {selectedRestaurant.visits}</p>
                {<p>Specialties: {selectedRestaurant.specialties.join(', ')}</p>}
                <div className="info-window-buttons">
                  <button className="info-window-button" onClick={() => handleVisit(selectedRestaurant)}>Log Visit</button>
                  <button className="info-window-button info-window-buttons--get-direction" onClick={getDirections}>Get Directions (via DRIVING)</button>
                </div>
              </div>
            </InfoWindow>
          )}

          {directions && (
            <DirectionsRenderer
              directions={directions}
            />
          )}
        </GoogleMap>

        {drawnShape && (
          <div className="shape-info">
            <h3>No. of Restaurants in Shape : {shapeRestaurants.length}</h3>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          {!showDrawingManager && <div className="button-container">
            <button onClick={() => setShowDrawingManager(!showDrawingManager)}>
              {showDrawingManager ? 'Activate Drawing Tools' : 'Activate Drawing Tools'}
            </button>
          </div>}
          <div className="button-container">
            <button onClick={toggleDashboard}>
              {showDashboard ? 'Hide Analytics Dashboard' : 'Show Analytics Dashboard'}
            </button>
          </div>
        </div>


      </div>


      <div className="analytics-container">
        {analyticsData && (
          <AnalyticsDashboard
            visitsByRestaurant={analyticsData.visitsByRestaurant}
            revenueByRestaurant={analyticsData.revenueByRestaurant}
            restaurantNames={analyticsData.restaurantNames}
            showDashboard={showDashboard}
          />
        )}
      </div>

    </LoadScript>
  );
};

export default Map;