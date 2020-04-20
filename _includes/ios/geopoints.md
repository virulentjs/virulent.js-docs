# GeoPoints

Parse allows you to associate real-world latitude and longitude coordinates with an object.  Adding a `PFGeoPoint` to a `PFObject` allows queries to take into account the proximity of an object to a reference point. This allows you to easily do things like find out what user is closest to another user or which places are closest to a user.

## PFGeoPoint

To associate a point with an object you first need to create a `PFGeoPoint`. For example, to create a point with latitude of 40.0 degrees and -30.0 degrees longitude:

<div class="language-toggle" markdown="1">
```objective_c
PFGeoPoint *point = [PFGeoPoint geoPointWithLatitude:40.0 longitude:-30.0];
```
```swift
let point = PFGeoPoint(latitude:40.0, longitude:-30.0)
```
</div>

This point is then stored in the object as a regular field.

<div class="language-toggle" markdown="1">
```objective_c
placeObject[@"location"] = point;
```
```swift
placeObject["location"] = point
```
</div>

Note: Currently only one key in a class may be a `PFGeoPoint`.

### Getting the User's Current Location

`PFGeoPoint` also provides a helper method for fetching the user's current location. This is accomplished via `geoPointForCurrentLocationInBackground`:

<div class="language-toggle" markdown="1">
```objective_c
[PFGeoPoint geoPointForCurrentLocationInBackground:^(PFGeoPoint *geoPoint, NSError *error) {
    if (!error) {
        // do something with the new geoPoint
    }
}];
```
```swift
PFGeoPoint.geoPointForCurrentLocationInBackground {
  (geoPoint: PFGeoPoint?, error: NSError?) -> Void in
  if error == nil {
    // do something with the new geoPoint
  }
}
```
</div>

When this code is run, the following happens:

1.  An internal `CLLocationManager` starts listening for location updates (via `startsUpdatingLocation`).
2.  Once a location is received, the location manager stops listening for location updates (via `stopsUpdatingLocation`) and a `PFGeoPoint` is created from the new location. If the location manager errors out, it still stops listening for updates, and returns an `NSError` instead.
3.  Your `block` is called with the `PFGeoPoint`.

For those who choose to use `CLLocationManager` directly, we also provide a `+geoPointWithLocation:` constructor to transform `CLLocation`s directly into `PFGeoPoint`s - great for apps that require constant polling.

## PFPolygon

Parse allows you to associate polygon coordinates with an object.  Adding a `PFPolygon` to a `PFObject` allows queries to determine whether a `PFGeoPoint` is within a `PFPolygon` or if a `PFPolygon` contains a `PFGeoPoint` .

* PFPolygon must contain at least three coordinates.

For example, to create a polygon with coordinates (0, 0), (0, 1), (1, 1), (1, 0).

<div class="language-toggle" markdown="1">
```objective_c
NSArray *points = @[@[@0,@0],@[@0,@1],@[@1,@1],@[@1,@0]];
PFPolygon *polygon = [PFPolygon polygonWithCoordinates:points];
```
```swift
let points = [[0,0], [0,1], [1,1], [1,0]]
let polygon = PFPolygon(coordinates: points)
```
</div>

This polygon is then stored in the object as a regular field.

<div class="language-toggle" markdown="1">
```objective_c
placeObject[@"bounds"] = polygon;
```
```swift
placeObject["bounds"] = polygon
```
</div>

## Geo Queries

Now that you have a bunch of objects with spatial coordinates, it would be nice to find out which objects are closest to a point. This can be done by adding another restriction to `PFQuery` using `whereKey:nearGeoPoint:`. Getting a list of ten places that are closest to a user may look something like:

<div class="language-toggle" markdown="1">
```objective_c
// User's location
PFGeoPoint *userGeoPoint = userObject[@"location"];
// Create a query for places
PFQuery *query = [PFQuery queryWithClassName:@"PlaceObject"];
// Interested in locations near user.
[query whereKey:@"location" nearGeoPoint:userGeoPoint];
// Limit what could be a lot of points.
query.limit = 10;
// Final list of objects
placesObjects = [query findObjects];
```
```swift
// User's location
let userGeoPoint = userObject["location"] as PFGeoPoint
// Create a query for places
var query = PFQuery(className:"PlaceObject")
// Interested in locations near user.
query.whereKey("location", nearGeoPoint:userGeoPoint)
// Limit what could be a lot of points.
query.limit = 10
// Final list of objects
placesObjects = query.findObjects()
```
</div>

 At this point `placesObjects` will be an array of objects ordered by distance (nearest to farthest) from `userGeoPoint`. Note that if an additional `orderByAscending:`/`orderByDescending:` constraint is applied, it will take precedence over the distance ordering.

 To limit the results using distance check out `whereKey:nearGeoPoint:withinMiles`, `whereKey:nearGeoPoint:withinKilometers`, and `whereKey:nearGeoPoint:withinRadians`.

It's also possible to query for the set of objects that are contained within a particular area. To find the objects in a rectangular bounding box, add the `whereKey:withinGeoBoxFromSouthwest:toNortheast:` restriction to your `PFQuery`.

<div class="language-toggle" markdown="1">
```objective_c
PFGeoPoint *swOfSF = [PFGeoPoint geoPointWithLatitude:37.708813 longitude:-122.526398];
PFGeoPoint *neOfSF = [PFGeoPoint geoPointWithLatitude:37.822802 longitude:-122.373962];
PFQuery *query = [PFQuery queryWithClassName:@"PizzaPlaceObject"];
[query whereKey:@"location" withinGeoBoxFromSouthwest:swOfSF toNortheast:neOfSF];
NSArray *pizzaPlacesInSF = [query findObjects];
```
```swift
let swOfSF = PFGeoPoint(latitude:37.708813, longitude:-122.526398)
let neOfSF = PFGeoPoint(latitude:37.822802, longitude:-122.373962)
var query = PFQuery(className:"PizzaPlaceObject")
query.whereKey("location", withinGeoBoxFromSouthwest:swOfSF, toNortheast:neOfSF)
var pizzaPlacesInSF = query.findObjects()
```
</div>

You can query for whether an object's `PFGeoPoint` lies within or on a polygon formed of `Parse.GeoPoint`:

<div class="language-toggle" markdown="1">
```objective_c
PFGeoPoint *geoPoint1 = [PFGeoPoint geoPointWithLatitude:10.0 longitude:20.0];
PFGeoPoint *geoPoint2 = [PFGeoPoint geoPointWithLatitude:20.0 longitude:30.0];
PFGeoPoint *geoPoint3 = [PFGeoPoint geoPointWithLatitude:30.0 longitude:40.0];
PFQuery *query = [PFQuery queryWithClassName:@"Locations"];
[query whereKey:@"location" withinPolygon:@[geoPoint1, geoPoint2, geoPoint3]];
```
```swift
let geoPoint1 = PFGeoPoint(latitude: 10.0, longitude: 20.0)
let geoPoint2 = PFGeoPoint(latitude: 20.0, longitude: 30.0)
let geoPoint3 = PFGeoPoint(latitude: 30.0, longitude: 40.0)
let query = PFQuery(className: "Locations")
query.whereKey("location", withinPolygon: [geoPoint1, geoPoint2, geoPoint3])
```
</div>

You can also query for whether an object `Parse.Polygon` contains a `Parse.GeoPoint`:

<div class="language-toggle" markdown="1">
```objective_c
PFGeoPoint *geoPoint = [PFGeoPoint geoPointWithLatitude:0.5 longitude:0.5];
PFQuery *query = [PFQuery queryWithClassName:@"Locations"];
[query whereKey:@"bounds" polygonContains:geoPoint];
```
```swift
let geoPoint = PFGeoPoint(latitude: 0.5, longitude: 0.5)
let query = PFQuery(className: "Locations")
query.whereKey("bounds", polygonContains: geoPoint)
```
</div>

To efficiently find if a `PFPolygon` contains a `PFGeoPoint` without querying use `containsPoint`.

<div class="language-toggle" markdown="1">
```objective_c
NSArray *points = @[@[@0,@0],@[@0,@1],@[@1,@1],@[@1,@0]];
PFPolygon *polygon = [PFPolygon polygonWithCoordinates:points];
PFGeoPoint *inside = [PFGeoPoint geoPointWithLatitude:0.5 longitude:0.5];
PFGeoPoint *outside = [PFGeoPoint geoPointWithLatitude:10 longitude:10];
// Returns True
[polygon containsPoint:inside];
// Returns False
[polygon containsPoint:outside];
```
```swift
let points = [[0,0], [0,1], [1,1], [1,0]]
let polygon = PFPolygon(coordinates: points)
let inside = PFGeoPoint(latitude: 0.5, longitude: 0.5)
let outside = PFGeoPoint(latitude: 10, longitude: 10)
// Returns true
polygon.contains(inside)
// Returns false
polygon.contains(outside)
```
</div>

## Caveats

At the moment there are a couple of things to watch out for:

1.  Each `PFObject` class may only have one key with a `PFGeoPoint` object.
2.  Using the `nearGeoPoint` constraint will also limit results to within 100 miles.
3.  Points should not equal or exceed the extreme ends of the ranges. Latitude should not be -90.0 or 90.0. Longitude should not be -180.0 or 180.0. Attempting to set latitude or longitude out of bounds will cause an error.
