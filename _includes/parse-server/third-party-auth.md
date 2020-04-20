# OAuth and 3rd Party Authentication

Parse Server supports 3rd party authentication with

* Apple
* Facebook
* Facebook AccountKit
* Github
* Google
* Instagram
* Janrain Capture
* Janrain Engage
* LDAP
* LinkedIn
* Meetup
* Microsoft Graph
* PhantAuth
* QQ
* Spotify
* Twitter
* vKontakte
* WeChat
* Weibo

Configuration options for these 3rd-party modules is done with the `auth` option passed to Parse Server:

```js
{
  auth: {
   twitter: {
     consumer_key: "", // REQUIRED
     consumer_secret: "" // REQUIRED
   },
   facebook: {
     appIds: "FACEBOOK APP ID"
   }
  }
}
```

## Supported 3rd party authentications

Below, you will find all expected payloads for logging in with a 3rd party auth.

Note, most of them don't require a server configuration so you can use them directly, without particular server configuration.

### Facebook `authData`

```js
{
  "facebook": {
    "id": "user's Facebook id number as a string",
    "access_token": "an authorized Facebook access token for the user",
    "expiration_date": "token expiration date of the format: yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
  }
}
```
Learn more about [Facebook login](https://developers.facebook.com/docs/authentication/).

### Facebook AccountKit `authData`
```js
{
  "facebookaccountkit": {
    "id": "user's Facebook Account Kit id number as a string",
    "access_token": "an authorized Facebook Account Kit access token for the user",
    // optional, access token via authorization code does not seem to have this in response
    "last_refresh": "time stamp at which token was last refreshed"
  }
}
```
The options passed to Parse server:
```js
{
  auth: {
   facebookaccountkit: {
     // your facebook app id
     appIds: ["id1", "id2"],
     // optional, if you have enabled the 'Require App Secret' setting in your app's dashboards
     appSecret: "App secret from Account Kit setting"
   }
  }
}
```
Learn more about [Facebook Account Kit](https://developers.facebook.com/docs/accountkit).

Two ways to [retrieve access token](https://developers.facebook.com/docs/accountkit/accesstokens).

### Twitter `authData`

```js
{
  "twitter": {
    "id": "user's Twitter id number as a string",
    "consumer_key": "your application's consumer key",
    "consumer_secret": "your application's consumer secret",
    "auth_token": "an authorized Twitter token for the user with your application",
    "auth_token_secret": "the secret associated with the auth_token"
  }
}
```

The options passed to Parse server:
```js
{
  auth: {
    twitter: {
     consumer_key: "", // REQUIRED
     consumer_secret: "" // REQUIRED
   },
  }
}
```

Learn more about [Twitter login](https://developer.twitter.com/en/docs/twitter-for-websites/log-in-with-twitter/guides/implementing-sign-in-with-twitter).

### Anonymous user `authData`

```js
{
  "anonymous": {
    "id": "random UUID with lowercase hexadecimal digits"
  }
}
```

### Apple `authData`

As of Parse Server 3.5.0 you can use [Sign In With Apple](https://developer.apple.com/sign-in-with-apple/get-started/).

```js
{
  "apple": {
    "id": "user",
    "token": "the identity token for the user"
  }
}
```

Using Apple Sign In on a iOS device will give you a `ASAuthorizationAppleIDCredential.user` string for the user identifier, which can be match the `sub` component of the JWT identity token.
Using Apple Sign In through the Apple JS SDK or through the REST service will only give you the JWT identity token (`id_token`) which you'll have to decompose to obtain the user identifier in its `sub` component. As an example you could use something like `JSON.parse(atob(token.split(".")[1])).sub`.

#### Configuring parse-server for Sign In with Apple

```js
{
  auth: {
   apple: {
     client_id: "", // optional (for extra validation), use the Service ID from Apple.
   },
  }
}
```

Learn more about [Sign In With Apple](https://developer.okta.com/blog/2019/06/04/what-the-heck-is-sign-in-with-apple).

### Github `authData`

```js
{
  "github": {
    "id": "user's Github id (string)",
    "access_token": "an authorized Github access token for the user"
  }
}
```

### Google `authData`

Google oauth supports validation of id_token's and access_token's.

```js
{
  "google": {
    "id": "user's Google id (string)",
    "id_token": "an authorized Google id_token for the user (use when not using access_token)",
    "access_token": "an authorized Google access_token for the user (use when not using id_token)"
  }
}
```

### Instagram `authData`

```js
{
  "instagram": {
    "id": "user's Instagram id (string)",
    "access_token": "an authorized Instagram access token for the user",
    "apiURL": "an api url to make requests. Default: https://api.instagram.com/v1/"
  }
}
```

### Configuring Parse Server for LDAP

The [LDAP](https://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol) module can check if a 
user can authenticate (bind) with the given credentials. Optionally, it can also check if the user is in a certain group.
This check is done using a user specified query, called an [LDAP Filter](https://ldap.com/ldap-filters/).
The query should return all groups which the user is a member of. The `cn` attribute of the query results is compared to `groupCn`.

To build a query which works with your LDAP server, you can use a LDAP client like [Apache Directory Studio](https://directory.apache.org/studio/).

```js
{
  "ldap": {
    "url": "ldap://host:port",
    "suffix": "the root of your LDAP tree",
    "dn": "Bind dn. {{id}} is replaced with the id suppied in authData",
    "groupCn": "Optional. A group which the user must be a member of.",
    "groupFilter": "Optional. An LDAP filter for finding groups which the user is part of. {{id}} is replaced with the id supplied in authData."
  }
}
```

If either `groupCN` or `groupFilter` is not specified, the group check is not performed.

Example Configuration (this works with the public LDAP test server hosted by Forumsys):

```js
{
  "ldap": {
    "url": "ldap://ldap.forumsys.com:389",
    "suffix": "dc=example,dc=com",
    "dn": "uid={{id}}, dc=example, dc=com",
    "groupCn": "Chemists",
    "groupFilter": "(&(uniqueMember=uid={{id}},dc=example,dc=com)(objectClass=groupOfUniqueNames))"
  }
}
```

authData:

```js
{
  "authData": {
    "ldap": {
      "id": "user id",
      "password": "password"
    }
  }
}
```

### LinkedIn `authData`

```js
{
  "linkedin": {
    "id": "user's LinkedIn id (string)",
    "access_token": "an authorized LinkedIn access token for the user",
    "is_mobile_sdk": true|false // set to true if you acquired the token through LinkedIn mobile SDK
  }
}
```

### Meetup `authData`

```js
{
  "meetup": {
    "id": "user's Meetup id (string)",
    "access_token": "an authorized Meetup access token for the user"
  }
}
```

### Microsoft Graph `authData`

```js
{
  "microsoft": {
    "id": "user's microsoft id (string)", // required
    "access_token": "an authorized microsoft graph access token for the user", // required
    "mail": "user's microsoft email (string)"
  }
}
```

Learn more about [Microsoft Graph Auth Overview](https://docs.microsoft.com/en-us/graph/auth/?view=graph-rest-1.0).

To [get access on behalf of a user](https://docs.microsoft.com/en-us/graph/auth-v2-user?view=graph-rest-1.0).

### PhantAuth `authData`

As of Parse Server 3.7.0 you can use [PhantAuth](https://www.phantauth.net/).

```js
{
  "phantauth": {
    "id": "user's PhantAuth sub (string)",
    "access_token": "an authorized PhantAuth access token for the user",
  }
}
```

Learn more about [PhantAuth](https://www.phantauth.net/).

### QQ `authData`

```js
{
  "qq": {
    "id": "user's QQ id (string)",
    "access_token": "an authorized QQ access token for the user"
  }
}
```

### Spotify `authData`

```js
{
  "spotify": {
    "id": "user's spotify id (string)",
    "access_token": "an authorized spotify access token for the user"
  }
}
```

### vKontakte `authData`

```js
{
  "vkontakte": {
    "id": "user's vkontakte id (string)",
    "access_token": "an authorized vkontakte access token for the user"
  }
}
```

#### Configuring parse-server for vKontakte

```js
{
  auth: {
   vkontakte: {
     appSecret: "", // REQUIRED, your vkontakte application secret
     appIds: "" // REQUIRED, your vkontakte application id
   },
  }
}
```

### WeChat `authData`

```js
{
  "wechat": {
    "id": "user's wechat id (string)",
    "access_token": "an authorized wechat access token for the user"
  }
}
```

### Weibo `authData`

```js
{
  "weibo": {
    "id": "user's weibo id (string)",
    "access_token": "an authorized weibo access token for the user"
  }
}
```

## Custom authentication

It is possible to leverage the OAuth support with any 3rd party authentication that you bring in.

```js
{

  auth: {
   my_custom_auth: {
     module: "PATH_TO_MODULE" // OR object,
     option1: "",
     option2: "",
   }
  }
}
```

On this module, you need to implement and export those two functions `validateAuthData(authData, options) {} ` and `validateAppId(appIds, authData, options) {}`.

For more information about custom auth please see the examples:

- [Facebook OAuth](https://github.com/parse-community/parse-server/blob/master/src/Adapters/Auth/facebook.js)
- [Twitter OAuth](https://github.com/parse-community/parse-server/blob/master/src/Adapters/Auth/twitter.js)
- [Instagram OAuth](https://github.com/parse-community/parse-server/blob/master/src/Adapters/Auth/instagram.js)
- [Microsoft Graph OAuth](https://github.com/parse-community/parse-server/blob/master/src/Adapters/Auth/microsoft.js)
