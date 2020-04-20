# GeoPoints

Parse allows you to associate real-world latitude and longitude coordinates with an object.  Adding a `ParseGeoPoint` to a `ParseObject` allows queries to take into account the proximity of an object to a reference point.  This allows you to easily do things like find out what user is closest to another user or which places are closest to a user.

## ParseGeoPoint

To associate a point with an object you first need to create a `ParseGeoPoint`.  For example, to create a point with latitude of 40.0 degrees and -30.0 degrees longitude:

```php
$point = new ParseGeoPoint(40.0, -30.0);
```

This point is then stored in the object as a regular field.

```php
$placeObject->set("location", $point);
```

Note: Currently only one key in a class may be a `ParseGeoPoint`.

## Geo Queries

Now that you have a bunch of objects with spatial coordinates, it would be nice to find out which objects are closest to a point.  This can be done by adding another restriction to `ParseQuery` using `near`.  Getting an array of ten places that are closest to a user may look something like:

```php
// User's location
$userGeoPoint = $userObject->get("location");
// Create a query for places
$query = new ParseQuery("PlaceObject");
// Interested in locations near user.
$query->near("location", $userGeoPoint);
// Limit what could be a lot of points.
$query->limit(10);
// Final array of objects
$placesObjects = $query->find();
```

At this point `$placesObjects` will be an array of objects ordered by distance (nearest to farthest) from `$userGeoPoint`. Note that if an additional `ascending()`/`descending()` order-by constraint is applied, it will take precedence over the distance ordering.

To limit the results using distance, check out `withinMiles`, `withinKilometers`, and `withinRadians`.

It's also possible to query for the set of objects that are contained within a particular area.  To find the objects in a rectangular bounding box, add the `withinGeoBox` restriction to your `ParseQuery`.

```php
$southwestOfSF = new ParseGeoPoint(37.708813, -122.526398);
$northeastOfSF = new ParseGeoPoint(37.822802, -122.373962);

$query = new ParseQuery("PizzaPlaceObject");
$query->withinGeoBox("location", $southwestOfSF, $northeastOfSF);
$pizzaPlacesInSF = $query->find();
```

## Caveats

At the moment there are a couple of things to watch out for:

1.  Each ParseObject class may only have one key with a ParseGeoPoint object.
2.  Using the `near` constraint will also limit results to within 100 miles.
3.  Points should not equal or exceed the extreme ends of the ranges.  Latitude should not be -90.0 or 90.0.  Longitude should not be -180.0 or 180.0.  Attempting to set latitude or longitude out of bounds will cause an error.
