# App Extensions

Local data sharing in Parse SDKs allows you do share persistent local data between your main application and extensions that it contains, including Keyboard, Share/Today/Photo/Action extensions and Document Providers.

## Shared Local Data

All local data that is persistent can be shared between apps and multiple extensions:

*  `PFUser currentUser`
*  Facebook/Twitter authentication attached to `currentUser`
*  `PFInstallation currentInstallation`
*  `installationId` which is used for Analytics events
*  `saveEventually` and `deleteEventually` pending operations
*  Pinned objects in Local Datastore

We do not recommend storing large pieces of data inside these persistent objects, both with and without data sharing enabled, as it might impact the performance of how fast this data is saved and loaded.

Furthermore, if you are using Local Datastore with data sharing - we recommend that you divide your objects amongst multiple pins, as querying and persisting data in a smaller pin is usually faster.

## Enable Data Sharing

To share your local data between app and extensions you need to do the following:

*   Enable **App Groups** and **Keychain Sharing** in **both** your app and extension capabilities in Xcode.
    Please note, that App Group identifier and Keychain Group should be the same between your app and all extensions for data sharing to work.
    <img alt="Configuring iOS extenstions" data-echo="{{ '/assets/images/extensions_capabilities.png' | prepend: site.baseurl }}"/>
*   Add the following before you initialize Parse in your Main App:

<div class="language-toggle" markdown="1">
```objective_c
// Enable data sharing in main app.
[Parse enableDataSharingWithApplicationGroupIdentifier:@"group.com.parse.parseuidemo"];
// Setup Parse
[Parse setApplicationId:@"<ParseAppId>" clientKey:@"<ClientKey>"];
```

```swift
// Enable data sharing in main app.
Parse.enableDataSharingWithApplicationGroupIdentifier("group.com.parse.parseuidemo")
// Setup Parse
Parse.setApplicationId("<ParseAppId>", clientKey: "<ClientKey>")
```
</div>

*   Add the following before you initialize Parse in your App Extension:

<div class="language-toggle" markdown="1">
```objective_c
// Enable data sharing in app extensions.
[Parse enableDataSharingWithApplicationGroupIdentifier:@"group.com.parse.parseuidemo"
                                 containingApplication:@"com.parse.parseuidemo"];
// Setup Parse
[Parse setApplicationId:@"<ParseAppId>" clientKey:@"<ClientKey>"];
```

```swift
// Enable data sharing in app extensions.
Parse.enableDataSharingWithApplicationGroupIdentifier("group.com.parse.parseuidemo",
                            containingApplicaiton: "com.parse.parseuidemo")
// Setup Parse
Parse.setApplicationId("<ParseAppId>", clientKey: "<ClientKey>")
```
</div>


As you might have noticed - there are few pieces of information that need to be in sync for this to work and be enabled:

*   **Application Group Identifier** - is the identifier of a shared container that Parse SDK is going to use to persist data locally and share the data.
*   **Keychain Sharing** means that your app and extension can access data that is securely stored in the keychain.
*   **Containing Application Identifier** is your main apps bundle identifier. This is required for app extensions to know which application to talk to.

This process is required to be completed for both your main application and any extension.

After all these steps are done, you are all set and all data will be shared between your app and any app extension that the app contains.

If you have an existing app using the Parse SDK, when users upgrade to your latest app version (with data sharing enabled), the Parse SDK will automatically move the main app's local persistent data (Local Datastore, current `PFUser`, current `PFInstallation`, etc) from the app's sandbox container to the shared container.
This migration is irreversible; if you later release another app version with data sharing disabled,
we will not move the shared container's data back into the main app's sandbox container.
For more about the app/extension shared container, please see Apple's [documentation](https://developer.apple.com/library/ios/documentation/General/Conceptual/ExtensibilityPG/ExtensionScenarios.html#//apple_ref/doc/uid/TP40014214-CH21-SW6).
