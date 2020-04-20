# Config

## Parse Config

`ParseConfig` is a way to configure your applications remotely by storing a single configuration object on Parse. It enables you to add things like feature gating or a simple "Message of the Day". To start using `ParseConfig` you need to add a few key/value pairs (parameters) to your app on the Parse Config Dashboard.

<img alt="Configuration Editor" data-echo="{{ '/assets/images/config_editor.png' | prepend: site.baseurl }}"/>

After that you will be able to fetch the `ParseConfig` on the client, like in this example:

```cs
ParseConfig config = null;
try {
  config = await ParseConfig.GetAsync();
} catch (Exception e) {
  // Something went wrong (e.g. request timed out)
}
```

## Retrieving Config

`ParseConfig` is built to be as robust and reliable as possible, even in the face of poor internet connections. Caching is used by default to ensure that the latest successfully fetched config is always available. In the below example we use `GetAsync` to retrieve the latest version of config from the server, and if the fetch fails we can simply fall back to the version that we successfully fetched before via `CurrentConfig`.

```cs
ParseConfig config = null;
try {
  config = await ParseConfig.GetAsync();
  Console.WriteLine("Yay! Config was fetched from the server.");
} catch (Exception e) {
  Console.WriteLine("Failed to fetch. Using Cached Config.");
  config = ParseConfig.CurrentConfig;
}

string welcomeMessage = null;
boolean result = config.TryGetValue("welcomeMessage", out welcomeMessage);
if (!result) {
  Console.WriteLine("Falling back to default message.");
  welcomeMessage = "Welcome!";
}

Console.WriteLine(String.Format("Welcome Messsage From Config = {0}", welcomeMessage));
```

## Current Config

Every `ParseConfig` instance that you get is always immutable. When you retrieve a new `ParseConfig` in the future from the network, it will not modify any existing `ParseConfig` instance, but will instead create a new one and make it available via `ParseConfig.CurrentConfig`. Therefore, you can safely pass around any `ParseConfig` object and safely assume that it will not automatically change.

It might be troublesome to retrieve the config from the server every time you want to use it. You can avoid this by simply using the cached `CurrentConfig` object and fetching the config only once in a while.

```cs
public class Helper
{
  private static TimeSpan configRefreshInterval = TimeSpan.FromHours(12);
  private static DateTime? lastFetchedDate;

  // Fetches the config at most once every 12 hours per app runtime
  public static void FetchConfigIfNeeded()
  {
    if (lastFetchedDate == null ||
        DateTime.Now - lastFetchedDate > configRefreshInterval) {
      lastFetchedDate = DateTime.Now;
      ParseConfig.GetAsync();
    }
  }
}
```

## Parameters

`ParseConfig`  supports most of the data types supported by `ParseObject`:

*   string
*   Numbers (boolean/int/double/long)
*   DateTime
*   ParseFile
*   ParseGeoPoint
*   IList<string, T>
*   IDictionary<T>

We currently allow up to **100** parameters in your config and a total size of **128KB** across all parameters.
