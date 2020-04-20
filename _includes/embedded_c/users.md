# Users & Sessions

At the core of many apps, there is a notion of user accounts that lets users access their information in a secure manner. In our other SDKs, we provide a specialized user class that automatically handles much of the functionality required for user account management. Users are a special class of Parse Objects and has all the same features, such as flexible schema, automatic persistence, and a key value interface.

You can sign in users via the REST API, but we do not recommend doing so unless your hardware device actually provides user keyboard input. In some cases, you may want to have a companion mobile or desktop app that lets the user sign up, and, that app [creates a restricted session]({{ site.baseUrl }}/ios/guide/#sessions) for the device running the embedded SDK. During your hardware device provisioning process, the phone can send this restricted session's token to the device. You can read more about users in our [REST API]({{ site.baseUrl }}/rest/guide/#users) or one of our other [SDK guides]({{ site.baseUrl }}/).

Once you have a session token, you can use it to act on the behalf of a particular user. The session token used by the SDK can be set with`parseSetSessionToken`:

```cpp
char token[] = "r:olqZkbv8fefVFNjWegyIXIggd";
parseSetSessionToken(client, token);
```

Once the session token is set, it will be associated with the current installation if it is not already associated with an installation. This association can be done only once and is automatically done by the SDK.

A session token is tied to a specific installation (specified by the installationId field on the Session object). Attempts to use a session token for another installation will result in errors.

If a session token is set before an installation is set, the SDK will create an installation for you. Thus, if you have a specific pair of installation ID and session token you need to use, you should set the installation ID first.

The session token can be cleared with`parseClearSessionToken` function. Once the token is cleared, the device will not be authenticated as the user anymore:

```cpp
parseClearSessionToken(client);
```

One can get the current session token by doing:

```cpp
char* session_token = parseGetSessionToken(client);
```

The session token will be persistent across reboots. Note that we highly recommend using Restricted Sessions on hardware devices, especially ones that do not provide a high level of client security. For more details, check out the [guide on Sessions]({{ site.baseUrl }}/rest/guide/#sessions).
