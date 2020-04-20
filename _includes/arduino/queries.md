# Queries

We've already seen how a `ParseObjectGet` with an `objectId` can retrieve a single object from Parse. There are many other ways to retrieve data with `ParseQuery` -- you can retrieve many objects at once, put conditions on the objects you wish to retrieve, and more.

## Basic Queries

The general pattern is to create a `ParseQuery`, put conditions on it, and then retrieve objects from the response. For example, to retrieve temperature data at a particular temperature, use the`whereEqualToInt` function to constrain the value for a key.

```cpp
ParseQuery query;
query.setClassName("Temperature");
query.whereEqualTo("temperature", 100.0);
ParseResponse response = query.send();
int countOfResults = response.count();
Serial.println(countOfResults);
while(response.nextObject()) {
	Serial.println(response.getJSONBody());
	Serial.println(response.getDouble("temperature"));
	Serial.println(response.getString("createdAt"));
}
response.close(); // Free the resource
```

## Query Constraints

Your query should have at least one constraint. There are several ways to put constraints on the objects found by a query. You can filter out objects with a particular key-value pair with:

```cpp
query.whereNotEqualTo("toaster", "foo");
```

You can give multiple constraints, and objects will only be in the results if they match all of the constraints. In other words, it's like an AND of constraints.

```cpp
query.whereEqualTo("leverDown", true);
query.whereEqualTo("temperature", 100.0);
```

You can limit the number of results by setting a limit. By default, results are limited to 100. In the old Parse hosted backend, the maximum limit was 1,000, but Parse Server removed that constraint:

```cpp
query.setLimit(10);
```

You can skip the first results by setting `skip`. In the old Parse hosted backend, the maximum skip value was 10,000, but Parse Server removed that constraint. This can be useful for pagination:

```cpp
query.setSkip(10);
```

For sortable types like numbers and strings, you can control the order in which results are returned:

```cpp
// Sorts the results in ascending order by the temperature field
query.orderBy("temperature");
// Sorts the results in descending order by the temperature field
query.orderBy("-temperature");
```

You can sort by multiple keys as follows:

```cpp
query.orderBy("temperature,name");
```

For sortable types, you can also use comparisons in queries:

```cpp
// Restricts to temperatures < 50
query.whereLessThan("temperature", 50.0);
// Restricts to temperatures > 50 query.
whereGreaterThan("temperature", 50.0);
// Restricts to temperatures >= 50 query.
whereGreaterThanOrEqualTo("temperature", 50.0);
```

You can restrict the fields returned by calling setKeys with a list of keys as a string. To retrieve objects that contain only the temperature field (and also special built-in fields such as`objectId`,`createdAt`, and`updatedAt`):

```cpp
query.setKeys("temperature");
```

This is useful if the object has fields which are not required by the device. Since the Arduino is a constrained environment, we recommend using a combination of `setKeys` and`setLimit` to reduce processing and memory overhead.
