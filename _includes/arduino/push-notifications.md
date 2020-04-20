# Push Notifications

Using Push Notifications, you'll be able to send realtime notifications to your Arduino. This can be triggered by changes in your data, custom code in Cloud Code, a companion mobile app, and much more.

## Installations

Every Parse application installed on a device registered for push notifications has an associated Installation object. The Installation object is where you store all the data needed to target push notifications. For example, you could send a connected thermostat a push to change the desired temperature.

There are two ways to create an Installation for the Arduino. You can generate an installation ID (random lowercase UUID) elsewhere (e.g. phone), send that to your arduino during initial provisioning, then set the installation ID on the arduino:

```cpp
// In this example, we associate this device with a pre-generated installation ID
Parse.setInstallationId("ab946c14-757a-4448-8b77-69704b01bb7b");
```

The installation ID is a unique identifier for the device, so you should make sure to assign different installation IDs to different devices (i.e. your UUID generator has enough randomness). After you do the above, the arduino will automatically create an Installation object with this installation ID.

If you do not pass in an installation ID, the`ParseClient` will automatically generate an installation ID for you, and create an Installation object with it upon the first request sent to Parse.

You can retrieve your installation ID with the`getInstallationId` function:

```cpp
String installationId = Parse.getInstallationId();
```

The installation ID is persisted across reboots.

The Installation class has several special fields that help you manage and target devices. The relevant ones for Arduino are:

*   `channels`: An array of the channels to which a device is currently subscribed.
*   `deviceType`: The type of device, "ios", "android", "winrt", "winphone", "dotnet", or “embedded” (readonly).
*   `installationId`: Universally Unique Identifier (UUID) for the device used by Parse. It must be unique across all of an app's installations.(readonly).
*   `appName`: The display name of the client application to which this installation belongs.
*   `appVersion`: The version string of the client application to which this installation belongs.
*   `parseVersion`: The version of the Parse SDK which this installation uses.

## Subscribing to Pushes

To subscribe to push notifications, make the following call in your`setup` function:

```cpp
Parse.startPushService();
```

Then, in your `loop` function:

```cpp
if (Parse.pushAvailable()) {
	ParsePush push = Parse.nextPush();
	// Print whole JSON body
	String message = push.getJSONBody();
	Serial.print("New push message size: ");
	Serial.println(message.length());
	Serial.print("New push message content: ");
	Serial.println(message);
	// Do something with the push
	// IMPORTANT, close your push message
	push.close();
}
```

## Sending Pushes

There are many ways to send a push notification. It's possible to send from the Arduino SDK via a call to the REST API, but you'll most likely be sending from another environment. [Read here for more information on how to send pushes]({{ site.baseUrl }}/rest/guide/#push-notifications).
